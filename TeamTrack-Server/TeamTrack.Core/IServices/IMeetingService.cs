using TeamTrack.Core.Entities;

namespace TeamTrack.Core.IServices
{
    public interface IMeetingService
    {
        Task<List<Meeting>> GetList();
        Task<Meeting?> GetById(int id);
        Task<Meeting> AddAsync(Meeting meeting);
        Task<Meeting?> UpdateAsync(Meeting meeting);
        Task<bool> DeleteAsync(int id); // מתוקן להחזרת bool – כדי לדעת אם נמחק
    }
}
