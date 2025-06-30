using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using TeamTrack.Core.IServices;

namespace TeamTrack.API.Controllers
{
    [ApiController]
    [Route("api/extract-keypoints")]
    [Authorize]
    public class KeyPointsController : ControllerBase
    {
        private readonly IOpenAiService _openAiService;
        private readonly ILogger<KeyPointsController> _logger;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public KeyPointsController(
            IOpenAiService openAiService,
            ILogger<KeyPointsController> logger,
            IAmazonS3 s3Client,
            IConfiguration configuration)
        {
            _openAiService = openAiService;
            _logger = logger;
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"] ?? throw new ArgumentNullException("AWS:BucketName missing in configuration.");
        }

        public class ExtractKeyPointsRequest
        {
            public string S3Key { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ExtractKeyPointsRequest request)
        {
            _logger.LogInformation("תחילת טיפול ב־/api/extract-keypoints עם S3Key: {S3Key}", request.S3Key);

            if (string.IsNullOrWhiteSpace(request.S3Key))
            {
                _logger.LogWarning("S3Key חסר או ריק");
                return BadRequest(new { error = "s3Key חסר או ריק." });
            }

            try
            {
                // שליפת הקובץ מ-S3
                _logger.LogInformation("שליפת קובץ מ-S3: {S3Key}", request.S3Key);
                var getObjectResponse = await _s3Client.GetObjectAsync(new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = request.S3Key
                });

                using var reader = new StreamReader(getObjectResponse.ResponseStream);
                var fileContent = await reader.ReadToEndAsync();

                // עיבוד מול OpenAI
                _logger.LogInformation("שליחת תוכן לעיבוד ב־OpenAI");
                var keyPoints = await _openAiService.ExtractKeyPointsAsync(fileContent);

                // שמירה חזרה לסיכום חדש ב-S3
                var summaryKey = $"summaries/{Guid.NewGuid()}.txt";
                _logger.LogInformation("שומר סיכום חדש ל־S3: {Key}", summaryKey);
                await _s3Client.PutObjectAsync(new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = summaryKey,
                    ContentBody = keyPoints,
                    ContentType = "text/plain"
                });

                // יצירת קישור זמני לקריאה
                var summaryLink = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = summaryKey,
                    Expires = DateTime.UtcNow.AddHours(1)
                });

                _logger.LogInformation("סיכום הועלה וקישור זמני נוצר בהצלחה");

                return Ok(new { keyPoints, summaryLink });
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "שגיאה בגישה ל־S3 עם S3Key: {S3Key}", request.S3Key);
                return StatusCode(500, new { error = $"שגיאה בגישה ל־S3: {ex.Message}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה פנימית במהלך עיבוד");
                return StatusCode(500, new { error = $"שגיאה פנימית: {ex.Message}" });
            }
        }

        [HttpOptions]
        [AllowAnonymous]
        public IActionResult Options() => Ok();
    }
}
