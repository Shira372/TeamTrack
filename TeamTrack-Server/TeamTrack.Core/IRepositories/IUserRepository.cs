using System.Collections.Generic;
using System.Threading.Tasks;
using TeamTrack.Core.Entities;

namespace TeamTrack.Core.IRepositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAll();    // עדכון לפונקציה אסינכרונית
        Task<User?> GetById(int id);  // עדכון לפונקציה אסינכרונית
        Task<User> Add(User user);    // עדכון לפונקציה אסינכרונית
        Task<User> Update(User user); // עדכון לפונקציה אסינכרונית
        Task<User?> Delete(int id);   // עדכון לפונקציה אסינכרונית
    }
}
