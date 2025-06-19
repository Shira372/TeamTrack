using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using TeamTrack.Core.IServices;
using Amazon.S3;
using Amazon.S3.Model;

namespace TeamTrack.API.Controllers
{
    [ApiController]
    [Route("api/keypoints")]
    [Authorize]
    public class KeyPointsController : ControllerBase
    {
        private readonly IOpenAiService _openAiService;
        private readonly ILogger<KeyPointsController> _logger;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName = "teamtrack-files"; // החלף לפי הצורך

        public KeyPointsController(IOpenAiService openAiService, ILogger<KeyPointsController> logger, IAmazonS3 s3Client)
        {
            _openAiService = openAiService;
            _logger = logger;
            _s3Client = s3Client;
        }

        [HttpPost]
        public async Task<IActionResult> ExtractKeyPointsFromS3([FromBody] S3KeyRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.S3Key))
            {
                return BadRequest(new { error = "s3Key חסר או ריק." });
            }

            try
            {
                var s3Object = await _s3Client.GetObjectAsync(_bucketName, request.S3Key);
                if (s3Object.ResponseStream == null)
                {
                    return NotFound(new { error = "לא נמצא קובץ עם המפתח שסופק." });
                }

                string text;
                using (var reader = new StreamReader(s3Object.ResponseStream))
                {
                    text = await reader.ReadToEndAsync();
                }

                var keyPoints = await _openAiService.ExtractKeyPointsAsync(text);
                return Ok(new { keyPoints });
            }
            catch (AmazonS3Exception s3Ex)
            {
                _logger.LogError(s3Ex, "שגיאה בגישה ל-S3");
                return StatusCode(500, new { error = "שגיאה בגישה ל-S3. ודא שהקובץ קיים." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בעיבוד קובץ מ-S3 לנקודות מפתח");
                return StatusCode(500, new { error = "שגיאה פנימית. נסה שוב מאוחר יותר." });
            }
        }
    }

    public class S3KeyRequest
    {
        public string S3Key { get; set; } = string.Empty;
    }
}
