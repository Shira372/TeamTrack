using TeamTrack.Core.Entities;
using TeamTrack.Core.IRepositories;
using Microsoft.EntityFrameworkCore;
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
            .Include(m => m.Users)       // כולל את המשתמשים בישיבה (קשר רבים-לרבים)
            .AsNoTracking()              // בלי לעקוב אחרי האובייקטים (לקריאה בלבד, משפר ביצועים)
            .ToListAsync();
    }

    public async Task<Meeting?> GetByIdAsync(int id)
    {
        return await _context.Meetings
            .Include(m => m.Users)       // כולל את המשתמשים בישיבה
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
        var existing = await _context.Meetings.FirstOrDefaultAsync(x => x.Id == meeting.Id);
        if (existing == null) return null;

        // עדכון הערכים הקיימים בערך החדש
        _context.Entry(existing).CurrentValues.SetValues(meeting);
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
