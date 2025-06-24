using TeamTrack.Core.Entities;

namespace TeamTrack.Core.IRepositories
{
    public interface IMeetingRepository
    {
        Task<List<Meeting>> GetAllAsync();
        Task<Meeting?> GetByIdAsync(int id);
        Task<Meeting> AddAsync(Meeting meeting);
        Task<Meeting> UpdateAsync(Meeting meeting);
        Task DeleteAsync(int id);
    }
}
