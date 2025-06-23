using Amazon.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        private const string BucketName = "teamtrack-files";

        public KeyPointsController(IAmazonS3 s3Client, IOpenAiService openAiService)
        {
            _s3Client = s3Client;
            _openAiService = openAiService;
        }

        public class ExtractKeyPointsRequest
        {
            public string S3Key { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ExtractKeyPointsRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.S3Key))
                return BadRequest(new { error = "s3Key חסר או ריק." });

            try
            {
                var s3Object = await _s3Client.GetObjectAsync(BucketName, request.S3Key);
                using var reader = new StreamReader(s3Object.ResponseStream);
                string text = await reader.ReadToEndAsync();

                var keyPoints = await _openAiService.ExtractKeyPointsAsync(text);
                return Ok(new { keyPoints });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, new { error = $"שגיאה בגישה ל־S3: {ex.Message}" });
            }
            catch (System.Exception ex)
            {
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
