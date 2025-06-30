using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TeamTrack.Core.IServices
{
    public interface IS3Service
    {
        Task<string> UploadFileAsync(IFormFile file);
        Task<(string fileUrl, string s3Key)> UploadFileWithKeyAsync(IFormFile file); // ← חדש
        Task<List<string>> ListFilesAsync();
    }
}
