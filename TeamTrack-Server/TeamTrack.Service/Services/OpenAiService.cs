using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TeamTrack.Core.IServices;

namespace TeamTrack.Service
{
    public class OpenAiService : IOpenAiService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public OpenAiService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<string> ExtractKeyPointsAsync(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                throw new ArgumentException("הטקסט ריק");

            bool containsHebrew = text.Any(c => c >= 'א' && c <= 'ת');
            string systemMessage = containsHebrew
                ? "חַלֵץ את הנקודות החשובות מהטקסט הבא בעברית."
                : "Extract the key points from the following text in English.";

            string openAiApiKey = _configuration["OpenAI:OpenAiApiKey"];
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", openAiApiKey);

            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "system", content = systemMessage },
                    new { role = "user", content = text }
                },
                max_tokens = 150,
                temperature = 0.5,
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);

            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);
            return doc.RootElement
                      .GetProperty("choices")[0]
                      .GetProperty("message")
                      .GetProperty("content")
                      .GetString();
        }


    }
}
