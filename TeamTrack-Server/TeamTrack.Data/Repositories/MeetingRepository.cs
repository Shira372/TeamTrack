using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TeamTrack.Core.Entities;
using TeamTrack.Core.IRepositories;
using TeamTrack.Data;

public class MeetingRepository : IMeetingRepository
{
    private readonly DataContext _context;

    public MeetingRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<List<Meeting>> GetAllAsync()
    {
        return await _context.Meetings
            .Include(m => m.Users)          // כולל את המשתתפים
            .Include(m => m.CreatedByUser)  // כולל את היוצר של הישיבה
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Meeting?> GetByIdAsync(int id)
    {
        return await _context.Meetings
            .Include(m => m.Users)          // כולל את המשתתפים
            .Include(m => m.CreatedByUser)  // כולל את היוצר של הישיבה
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Meeting> AddAsync(Meeting meeting)
    {
        await _context.Meetings.AddAsync(meeting);
        return meeting;
    }

    public async Task<Meeting?> UpdateAsync(Meeting meeting)
    {
        var existing = await _context.Meetings
            .Include(m => m.Users) // חובה כדי לעדכן את רשימת המשתתפים
            .FirstOrDefaultAsync(x => x.Id == meeting.Id);

        if (existing == null) return null;

        // עדכון שדות בסיסיים בלבד
        existing.MeetingName = meeting.MeetingName;
        existing.TranscriptionLink = meeting.TranscriptionLink;
        existing.SummaryLink = meeting.SummaryLink;
        existing.UpdatedAt = DateTime.UtcNow;

        // עדכון משתתפים (Users)
        existing.Users.Clear();
        foreach (var user in meeting.Users)
        {
            var userFromDb = await _context.Users.FindAsync(user.Id);
            if (userFromDb != null)
            {
                existing.Users.Add(userFromDb);
            }
        }

        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting != null)
        {
            _context.Meetings.Remove(meeting);
        }
    }
}
