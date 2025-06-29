using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        // מחזיר את כל הישיבות כולל המשתתפים והיוצר
        return await _repositoryManager.MeetingRepository.GetAllAsync();
    }

    public async Task<Meeting?> GetById(int id)
    {
        // מחפש ישיבה לפי מזהה כולל המשתתפים והיוצר
        return await _repositoryManager.MeetingRepository.GetByIdAsync(id);
    }

    public async Task<Meeting> AddAsync(Meeting meeting)
    {
        // בדיקה אם היוצר קיים במסד
        var creator = await _userService.GetById(meeting.CreatedByUserId ?? 0);
        if (creator == null)
            throw new ArgumentException("המשתמש היוצר לא קיים במסד הנתונים.");

        // המשתתפים כבר נטענו בקונטרולר
        meeting.Users ??= new List<User>();

        // הוספת הישיבה למסד ושמירת שינויים
        var added = await _repositoryManager.MeetingRepository.AddAsync(meeting);
        await _repositoryManager.SaveAsync();
        return added;
    }

    public async Task<Meeting?> UpdateAsync(Meeting meeting)
    {
        var existing = await _repositoryManager.MeetingRepository.GetByIdAsync(meeting.Id);
        if (existing == null) return null;

        // עדכון שדות בסיסיים
        existing.MeetingName = meeting.MeetingName;
        existing.SummaryLink = meeting.SummaryLink;
        existing.TranscriptionLink = meeting.TranscriptionLink;
        existing.UpdatedAt = DateTime.UtcNow;

        // אפשרות לעדכן משתתפים (נשאר פה, כדי להבטיח יציבות)
        if (meeting.Users != null)
        {
            var validatedUsers = new List<User>();
            foreach (var userToAdd in meeting.Users)
            {
                var existingUser = await _userService.GetById(userToAdd.Id);
                if (existingUser != null)
                    validatedUsers.Add(existingUser);
            }
            existing.Users = validatedUsers;
        }

        var updated = await _repositoryManager.MeetingRepository.UpdateAsync(existing);
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
