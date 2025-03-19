using TeamTrack.Core.Entities;
using TeamTrack.Core.IRepositories;
using TeamTrack.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;

public class MeetingRepository : IMeetingRepository
{
    private readonly DataContext _context;

    public MeetingRepository(DataContext context)
    {
        _context = context;
    }

    // מימוש המתודה GetAllAsync
    public async Task<List<Meeting>> GetAllAsync()
    {
        return await _context.Meetings
            .Include(m => m.Users)
            .AsNoTracking() // שמירה על AsNoTracking לקריאה בלבד
            .ToListAsync();
    }

    // מימוש המתודה GetByIdAsync
    public async Task<Meeting?> GetByIdAsync(int id)
    {
        return await _context.Meetings
            .Include(m => m.Users)
            .AsNoTracking() // שמירה על AsNoTracking לקריאה בלבד
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    // מימוש המתודה AddAsync
    public async Task<Meeting> AddAsync(Meeting meeting)
    {
        // אם יש ישות כזו עם אותו Id, מבצעים עדכון ולא הוספה
        var existingMeeting = await _context.Meetings
            .FirstOrDefaultAsync(m => m.Id == meeting.Id);

        if (existingMeeting != null)
        {
            // אם יש ישות כזו, עדכנים אותה במקום להוסיף חדשה
            return await UpdateAsync(meeting);
        }

        // אם אין ישות כזו, אז מוסיפים אותה כחדשה
        await _context.Meetings.AddAsync(meeting);
        return meeting; // אין שמירה פה - השמירה תתבצע ב-RepositoryManager
    }

    // מימוש המתודה UpdateAsync
    public async Task<Meeting> UpdateAsync(Meeting meeting)
    {
        var existingMeeting = await _context.Meetings
            .FirstOrDefaultAsync(x => x.Id == meeting.Id);

        if (existingMeeting == null)
        {
            return null; // אם לא קיימת, מחזירים null
        }

        // עדכון הישיבה
        _context.Entry(existingMeeting).CurrentValues.SetValues(meeting);
        return meeting;
    }

    // מימוש המתודה DeleteAsync
    public async Task DeleteAsync(int id)
    {
        var meeting = await GetByIdAsync(id);
        if (meeting != null)
        {
            _context.Meetings.Remove(meeting);
        }
    }
}
