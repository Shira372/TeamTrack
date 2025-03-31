using System.Collections.Generic;
using System.Threading.Tasks;
using TeamTrack.Core.Entities;

namespace TeamTrack.Core.IServices
{
    public interface IUserService
    {
        Task<List<User>> GetList();
        Task<User?> GetById(int id);
        Task<User> Add(User user);
        Task<User> Update(User user);
        Task<User?> Delete(int id);

        // שיטות חדשות
        Task<User?> GetByUserName(string userName);
        Task<User?> GetByEmail(string email);

        // פונקציה לאימות משתמש
        Task<User?> AuthenticateUser(string userName, string password); // פונקציה לאימות משתמש
    }
}
