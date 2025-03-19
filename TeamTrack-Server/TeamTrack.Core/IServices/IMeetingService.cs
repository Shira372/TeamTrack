using TeamTrack.Core.Entities;

namespace TeamTrack.Core.IServices
{
    public interface IMeetingService
    {
        Task<List<Meeting>> GetList();  // שינוי ל-Task<List<Meeting>>
        Task<Meeting?> GetById(int id); // שינוי ל-Task<Meeting?>
        Task<Meeting> AddAsync(Meeting meeting); // שינוי ל-Task<Meeting>
        Task<Meeting> UpdateAsync(Meeting meeting); // שינוי ל-Task<Meeting>
        Task DeleteAsync(int id); // שינוי ל-Task
    }
}
