using System.Collections.Generic;
using System.Threading.Tasks;
using TeamTrack.Core.Entities;

namespace TeamTrack.Core.IRepositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAll();
        Task<User?> GetById(int id);
        Task<User> Add(User user);
        Task<User> Update(User user);
        Task<User?> Delete(int id);

        // הוספת שיטות חיפוש
        Task<User?> GetByUserName(string userName); // פונקציה לחיפוש משתמש לפי שם משתמש
        Task<User?> GetByEmail(string email);       // פונקציה לחיפוש משתמש לפי אימייל

        // פונקציה לאימות משתמש
        Task<User?> AuthenticateUser(string userName, string password); // פונקציה לאימות משתמש לפי שם וסיסמה
    }
}
