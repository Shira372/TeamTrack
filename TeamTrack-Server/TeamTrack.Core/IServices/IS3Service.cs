using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TeamTrack.Core.IServices
{
    public interface IS3Service
    {
        Task<string> UploadFileAsync(IFormFile file);
        Task<List<string>> ListFilesAsync();
    }
}
