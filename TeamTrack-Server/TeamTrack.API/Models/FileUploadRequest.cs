using Microsoft.AspNetCore.Http;

namespace TeamTrack.API.Models
{
    public class FileUploadRequest
    {
        public required IFormFile File { get; set; }
    }

}
