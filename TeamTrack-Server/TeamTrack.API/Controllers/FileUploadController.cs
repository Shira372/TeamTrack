using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using TeamTrack.API.Models;
using TeamTrack.Core.IServices;
using System.Collections.Generic;

namespace TeamTrack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IS3Service _s3Service;
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(IS3Service s3Service, ILogger<FileUploadController> logger)
        {
            _s3Service = s3Service;
            _logger = logger;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadFile([FromForm] FileUploadRequest request)
        {
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest(new { error = "לא נבחר קובץ להעלאה." });
            }

            try
            {
                var (fileUrl, s3Key) = await _s3Service.UploadFileWithKeyAsync(request.File);

                return Ok(new
                {
                    fileUrl,
                    s3Key
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בעת העלאת קובץ ל-S3");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "אירעה שגיאה בשרת בזמן העלאת הקובץ. אנא נסה שוב מאוחר יותר."
                });
            }
        }

        [HttpGet("files")]
        public async Task<IActionResult> GetFiles()
        {
            try
            {
                List<string> files = await _s3Service.ListFilesAsync();
                return Ok(files);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בעת שליפת קבצים מ־S3");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "אירעה שגיאה בעת שליפת הקבצים."
                });
            }
        }
    }
}
