using TeamTrack.Core.Entities;

namespace TeamTrack.Core.IRepositories
{
    public interface IMeetingRepository
    {
        Task<List<Meeting>> GetAllAsync();    // שינוי ל-GetAllAsync
        Task<Meeting?> GetByIdAsync(int id);  // שינוי ל-GetByIdAsync
        Task<Meeting> AddAsync(Meeting meeting);  // שינוי ל-AddAsync
        Task<Meeting> UpdateAsync(Meeting meeting); // שינוי ל-UpdateAsync
        Task DeleteAsync(int id);  // שינוי ל-DeleteAsync
    }
}
