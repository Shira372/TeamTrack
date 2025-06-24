using TeamTrack.Core.Entities;
using TeamTrack.Core.IRepositories;
using TeamTrack.Core.IServices;

public class MeetingService : IMeetingService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IUserService _userService;

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
        var user = await _userService.GetById(meeting.CreatedByUserId ?? 0);
        if (user == null)
            throw new ArgumentException("המשתמש לא קיים במסד הנתונים.");

        var added = await _repositoryManager.MeetingRepository.AddAsync(meeting);
        await _repositoryManager.SaveAsync();
        return added;
    }

    public async Task<Meeting?> UpdateAsync(Meeting meeting)
    {
        var updated = await _repositoryManager.MeetingRepository.UpdateAsync(meeting);
        if (updated == null) return null;

        await _repositoryManager.SaveAsync();
        return updated;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var meeting = await _repositoryManager.MeetingRepository.GetByIdAsync(id);
        if (meeting == null) return false;

        await _repositoryManager.MeetingRepository.DeleteAsync(id);
        await _repositoryManager.SaveAsync();
        return true;
    }
}
