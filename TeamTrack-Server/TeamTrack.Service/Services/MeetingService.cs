using TeamTrack.Core.Entities;
using TeamTrack.Core.IRepositories;
using TeamTrack.Core.IServices;

public class MeetingService : IMeetingService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IUserService _userService; // להוסיף את שירות המשתמש

    public MeetingService(IRepositoryManager repositoryManager, IUserService userService)
    {
        _repositoryManager = repositoryManager;
        _userService = userService;
    }

    public async Task<List<Meeting>> GetList()
    {
        return await _repositoryManager.MeetingRepository.GetAllAsync();
    }

    public async Task<Meeting?> GetById(int id)
    {
        return await _repositoryManager.MeetingRepository.GetByIdAsync(id);
    }

    public async Task<Meeting> AddAsync(Meeting meeting)
    {
        // וודא שהמשתמש קיים לפני יצירת הישיבה
        var user = await _userService.GetById(meeting.CreatedByUserId ?? 0); // אם CreatedByUserId הוא null או לא תקין, השתמש ב-0
        if (user == null)
        {
            throw new ArgumentException("המשתמש לא קיים במסד הנתונים.");
        }

        // אם המשתמש קיים, אז הוסף את הישיבה
        var addedMeeting = await _repositoryManager.MeetingRepository.AddAsync(meeting);
        return addedMeeting; 
    }

    public async Task<Meeting> UpdateAsync(Meeting meeting)
    {
        var updatedMeeting = await _repositoryManager.MeetingRepository.UpdateAsync(meeting);
        return updatedMeeting; 
    }

    public async Task DeleteAsync(int id)
    {
        await _repositoryManager.MeetingRepository.DeleteAsync(id);
        
    }
}
