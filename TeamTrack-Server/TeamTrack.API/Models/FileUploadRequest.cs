using Microsoft.AspNetCore.Http;

namespace TeamTrack.API.Models
{
    public class FileUploadRequest
    {
        public IFormFile File { get; set; }
    }

}
