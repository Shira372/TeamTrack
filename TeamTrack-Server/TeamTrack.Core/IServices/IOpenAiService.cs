using System.Threading.Tasks;

namespace TeamTrack.Core.IServices
{
    public interface IOpenAiService
    {
        Task<string> ExtractKeyPointsAsync(string text);
    }
}
