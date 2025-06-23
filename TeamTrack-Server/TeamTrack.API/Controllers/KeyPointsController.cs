using Amazon.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; // הוספת שימוש בלוגר
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
        private readonly IAmazonS3 _s3Client;
        private readonly IOpenAiService _openAiService;
        private readonly ILogger<KeyPointsController> _logger; // לוגר
        private const string BucketName = "teamtrack-files";

        public KeyPointsController(IAmazonS3 s3Client, IOpenAiService openAiService, ILogger<KeyPointsController> logger)
        {
            _s3Client = s3Client;
            _openAiService = openAiService;
            _logger = logger;
        }

        public class ExtractKeyPointsRequest
        {
            public string S3Key { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ExtractKeyPointsRequest request)
        {
            _logger.LogInformation("התחלת טיפול ב-POST לנתיב /api/extract-keypoints עם S3Key: {S3Key}", request.S3Key);

            if (string.IsNullOrWhiteSpace(request.S3Key))
            {
                _logger.LogWarning("בקשה עם S3Key ריק או חסר");
                return BadRequest(new { error = "s3Key חסר או ריק." });
            }

            try
            {
                _logger.LogInformation("מנסה לקרוא את האובייקט מ-S3 עם המפתח: {S3Key}", request.S3Key);
                var s3Object = await _s3Client.GetObjectAsync(BucketName, request.S3Key);

                using var reader = new StreamReader(s3Object.ResponseStream);
                string text = await reader.ReadToEndAsync();

                _logger.LogInformation("קורא שירות OpenAI כדי להוציא נקודות מפתח");
                var keyPoints = await _openAiService.ExtractKeyPointsAsync(text);

                _logger.LogInformation("הוצאת נקודות מפתח בוצעה בהצלחה");
                return Ok(new { keyPoints });
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "שגיאה בגישה ל-S3 עם המפתח: {S3Key}", request.S3Key);
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
