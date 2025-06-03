using TeamTrack.Core.Entities;
using TeamTrack.Core.IRepositories;
using TeamTrack.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<User> Add(User user)
    {
        var existingUser = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == user.Id);

        if (existingUser != null)
        {
            _context.Users.Update(user); // עדכון אם כבר קיים
        }
        else
        {
            await _context.Users.AddAsync(user); // הוספה אם לא קיים
        }

        return user; // לא שומרים פה, רק מבצעים את הפעולה
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

    public async Task<User?> GetByUserName(string userName)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserName == userName);
    }

    public async Task<User?> GetByEmail(string email)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    // פונקציה חדשה לאימות משתמש לפי שם משתמש וסיסמה
    public async Task<User?> AuthenticateUser(string userName, string password)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserName == userName);

        if (user != null && user.PasswordHash == password)
        {
            return user;
        }
        return null;
    }
}
