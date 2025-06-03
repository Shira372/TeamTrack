using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using TeamTrack.Core.IServices;
using TeamTrack.API.Models;

namespace TeamTrack.API.Controllers
{
    [ApiController]
    [Route("api/keypoints")]
    [Authorize]
    public class KeyPointsController : ControllerBase
    {
        private readonly IOpenAiService _openAiService;

        public KeyPointsController(IOpenAiService openAiService)
        {
            _openAiService = openAiService;
        }

        [HttpPost("extract")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ExtractKeyPoints([FromForm] KeyPointsRequest request)
        {
            try
            {
                var file = request.File;

                if (file == null || file.Length == 0)
                    return BadRequest("קובץ לא תקין");

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
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
