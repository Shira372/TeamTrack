using TeamTrack.Core.Entities;
using TeamTrack.Core.IRepositories;
using TeamTrack.Data;
using Microsoft.EntityFrameworkCore;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;

    public UserRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAll()
    {
        return await _context.Users
            .AsNoTracking() // הוספת AsNoTracking לקריאה בלבד
            .ToListAsync();
    }

    public async Task<User?> GetById(int id)
    {
        return await _context.Users
            .AsNoTracking() // הוספת AsNoTracking לקריאה בלבד
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<User> Add(User user)
    {
        // בדוק אם המשתמש כבר קיים (למשל, עם אותו מזהה)
        var existingUser = await _context.Users
            .AsNoTracking() // הוספת AsNoTracking לקריאה בלבד
            .FirstOrDefaultAsync(u => u.Id == user.Id);

        if (existingUser != null)
        {
            // אם הוא כבר קיים, עדכן את המשתמש במקום להוסיף חדש
            _context.Users.Update(user);
        }
        else
        {
            // אם הוא לא קיים, הוסף את המשתמש כחדש
            await _context.Users.AddAsync(user);
        }

        return user;
    }

    public async Task<User> Update(User user)
    {
        _context.Users.Update(user);
        return user;
    }

    public async Task<User?> Delete(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            return user;
        }
        return null;
    }
}
