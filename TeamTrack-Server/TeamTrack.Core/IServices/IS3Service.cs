using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace TeamTrack.Core.IServices
{
    public interface IS3Service
    {
        Task<string> UploadFileAsync(IFormFile file);
    }
}


