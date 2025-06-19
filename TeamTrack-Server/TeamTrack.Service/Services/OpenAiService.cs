using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TeamTrack.Core.IServices;

namespace TeamTrack.Service
{
    public class OpenAiService : IOpenAiService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OpenAiService> _logger;

        public OpenAiService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<OpenAiService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
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
            if (string.IsNullOrWhiteSpace(openAiApiKey))
                throw new InvalidOperationException("OpenAI API key not found in configuration.");

            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(30); // Timeout מוגדר
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

            _logger.LogInformation("📤 שולח טקסט ל-OpenAI, אורך {Length}", text.Length);

            try
            {
                var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);

                if (!response.IsSuccessStatusCode)
                {
                    string errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("⚠️ OpenAI החזיר שגיאה: {StatusCode} - {Content}", response.StatusCode, errorContent);
                    throw new Exception($"שגיאה מ־OpenAI: {response.StatusCode} - {errorContent}");
                }

                string responseString = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("✅ תשובה התקבלה מ־OpenAI");

                using var doc = JsonDocument.Parse(responseString);
                return doc.RootElement
                          .GetProperty("choices")[0]
                          .GetProperty("message")
                          .GetProperty("content")
                          .GetString();
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "⏳ הבקשה ל־OpenAI חרגה מה־Timeout");
                throw new Exception("הבקשה ל־OpenAI נמשכה זמן רב מדי ונותקה.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ שגיאה כללית בקריאה ל־OpenAI");
                throw new Exception("אירעה שגיאה בעת עיבוד הבקשה ל־OpenAI.");
            }
        }
    }
}
