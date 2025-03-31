using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace TeamTrack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        // API שמקבל את הקובץ
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles", file.FileName);

            // ודא שהתרחיב של ה-Directory קיים
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { FilePath = filePath });
        }
    }
}
