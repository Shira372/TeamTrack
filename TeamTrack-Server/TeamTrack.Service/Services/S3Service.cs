using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using TeamTrack.Core.IServices;

namespace TeamTrack.Service
{
    public class S3Service : IS3Service
    {
        private readonly string _accessKey;
        private readonly string _secretKey;
        private readonly string _bucketName;
        private readonly string _region;

        public S3Service(IConfiguration configuration)
        {
            _accessKey = configuration["AWS:AccessKey"] ?? throw new ArgumentNullException("AWS:AccessKey");
            _secretKey = configuration["AWS:SecretKey"] ?? throw new ArgumentNullException("AWS:SecretKey");
            _bucketName = configuration["AWS:BucketName"] ?? throw new ArgumentNullException("AWS:BucketName");
            _region = configuration["AWS:Region"] ?? throw new ArgumentNullException("AWS:Region");
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var (url, _) = await UploadFileWithKeyAsync(file);
            return url;
        }

        public async Task<(string fileUrl, string s3Key)> UploadFileWithKeyAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid file");

            var s3Key = $"uploads/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            using var stream = file.OpenReadStream();
            var client = new AmazonS3Client(_accessKey, _secretKey, Amazon.RegionEndpoint.GetBySystemName(_region));

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = stream,
                Key = s3Key,
                BucketName = _bucketName,
                ContentType = file.ContentType
            };

            var fileTransferUtility = new TransferUtility(client);
            await fileTransferUtility.UploadAsync(uploadRequest);

            var urlRequest = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = s3Key,
                Expires = DateTime.UtcNow.AddHours(1)
            };

            var fileUrl = client.GetPreSignedURL(urlRequest);
            return (fileUrl, s3Key);
        }

        public async Task<List<string>> ListFilesAsync()
        {
            var client = new AmazonS3Client(_accessKey, _secretKey, Amazon.RegionEndpoint.GetBySystemName(_region));
            var request = new ListObjectsV2Request
            {
                BucketName = _bucketName
            };

            var response = await client.ListObjectsV2Async(request);
            var urls = new List<string>();

            foreach (var entry in response.S3Objects)
            {
                var url = $"https://{_bucketName}.s3.{_region}.amazonaws.com/{entry.Key}";
                urls.Add(url);
            }

            return urls;
        }
    }
}
