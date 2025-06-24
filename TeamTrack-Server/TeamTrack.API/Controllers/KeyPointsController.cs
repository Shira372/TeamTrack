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
            _logger.LogInformation("\u05d4\u05ea\u05d7\u05dc\u05d4 \u05d1\u05d8\u05d9\u05e4\u05d5\u05dc /api/extract-keypoints עם S3Key: {S3Key}", request.S3Key);

            if (string.IsNullOrWhiteSpace(request.S3Key))
            {
                _logger.LogWarning("\u05e0\u05e9\u05dc\u05d7 S3Key \u05e8\u05d9\u05e7 או חסר");
                return BadRequest(new { error = "s3Key חסר או ריק." });
            }

            try
            {
                _logger.LogInformation("\u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05e7\u05d1\u05e6 \u05de\u05e7\u05d5\u05d1\u05e5 S3: {S3Key}", request.S3Key);
                var getObjectResponse = await _s3Client.GetObjectAsync(new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = request.S3Key
                });

                using var reader = new StreamReader(getObjectResponse.ResponseStream);
                string fileContent = await reader.ReadToEndAsync();

                _logger.LogInformation("\u05e9\u05d5\u05dc\u05d7 \u05e2\u05d9\u05d1\u05d5\u05d3 \u05dc-OpenAI");
                var keyPoints = await _openAiService.ExtractKeyPointsAsync(fileContent);

                _logger.LogInformation("\u05e0\u05e7\u05d5\u05d3\u05d5\u05ea \u05de\u05e4\u05ea\u05d7 \u05e0\u05d7\u05e6\u05d5");
                return Ok(new { keyPoints });
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d2\u05d9\u05e9\u05d4 \u05dc-S3 עם מפתח: {S3Key}", request.S3Key);
                return StatusCode(500, new { error = $"שגיאה בגישה ל־S3: {ex.Message}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "\u05e9\u05d2\u05d9\u05d0\u05d4 \u05e4\u05e0\u05d9\u05de\u05d9\u05ea \u05d1\u05e9\u05e8\u05ea");
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
