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
        private readonly string _bucketName;
        private readonly IAmazonS3 _s3Client;

        public KeyPointsController(
            IOpenAiService openAiService,
            ILogger<KeyPointsController> logger,
            IAmazonS3 s3Client,
            IConfiguration configuration)
        {
            _openAiService = openAiService;
            _logger = logger;
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"] ?? "";
        }

        public class ExtractKeyPointsRequest
        {
            public string S3Key { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ExtractKeyPointsRequest request)
        {
            _logger.LogInformation("התחלה בטיפול /api/extract-keypoints עם S3Key: {S3Key}", request.S3Key);

            if (string.IsNullOrWhiteSpace(request.S3Key))
            {
                _logger.LogWarning("נשלח S3Key ריק או חסר");
                return BadRequest(new { error = "s3Key חסר או ריק." });
            }

            try
            {
                _logger.LogInformation("ניסיון קבץ מקובץ S3: {S3Key}", request.S3Key);
                var getObjectResponse = await _s3Client.GetObjectAsync(new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = request.S3Key
                });

                using var reader = new StreamReader(getObjectResponse.ResponseStream);
                string fileContent = await reader.ReadToEndAsync();

                _logger.LogInformation("שולח עיבוד ל-OpenAI");
                var keyPoints = await _openAiService.ExtractKeyPointsAsync(fileContent);

                _logger.LogInformation("שומר את התוצאה בקובץ חדש ב-S3");
                var summaryKey = $"summaries/{Guid.NewGuid()}.txt";
                var putRequest = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = summaryKey,
                    ContentBody = keyPoints,
                    ContentType = "text/plain"
                };
                await _s3Client.PutObjectAsync(putRequest);

                // יצירת קישור זמני
                var requestUrl = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = summaryKey,
                    Expires = DateTime.UtcNow.AddMinutes(60)
                };
                string summaryLink = _s3Client.GetPreSignedURL(requestUrl);

                _logger.LogInformation("נקודות מפתח הוחזרו בהצלחה + קישור זמני נוצר");
                return Ok(new { keyPoints, summaryLink });
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "שגיאה בגישה ל-S3 עם מפתח: {S3Key}", request.S3Key);
                return StatusCode(500, new { error = $"שגיאה בגישה ל־S3: {ex.Message}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה פנימית בשרת");
                return StatusCode(500, new { error = $"שגיאה פנימית: {ex.Message}" });
            }
        }

        [HttpOptions]
        [AllowAnonymous]
        public IActionResult Options()
        {
            return Ok();
        }
    }
}
