using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using TeamTrack.Core.IServices;
using TeamTrack.API.Models;
using Microsoft.Extensions.Logging;

namespace TeamTrack.API.Controllers
{
    [ApiController]
    [Route("api/keypoints")]
    [Authorize]
    public class KeyPointsController : ControllerBase
    {
        private readonly IOpenAiService _openAiService;
        private readonly ILogger<KeyPointsController> _logger;

        public KeyPointsController(IOpenAiService openAiService, ILogger<KeyPointsController> logger)
        {
            _openAiService = openAiService;
            _logger = logger;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ExtractKeyPoints([FromForm] KeyPointsRequest request)
        {
            try
            {
                var file = request.File;

                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "קובץ לא תקין או ריק." });

                string text;
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    text = await reader.ReadToEndAsync();
                }

                var keyPoints = await _openAiService.ExtractKeyPointsAsync(text);

                return Ok(new { keyPoints });
            }
            catch (Exception ex)
            {
                // רישום השגיאה ללוג
                _logger.LogError(ex, "שגיאה בעת עיבוד נקודות מפתח");

                // החזרת שגיאה עם סטטוס 500
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "אירעה שגיאה בשרת. נסה שוב מאוחר יותר." });
            }
        }
    }
}
