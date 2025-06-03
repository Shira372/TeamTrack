using TeamTrack.Core.Entities;
using TeamTrack.Core.IRepositories;
using TeamTrack.Core.IServices;
using System.Threading.Tasks;

public class UserService : IUserService
{
    private readonly IRepositoryManager _repositoryManager;

    public UserService(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<List<User>> GetList()
    {
        return await _repositoryManager.UserRepository.GetAll();
    }

    public async Task<User?> GetById(int id)
    {
        return await _repositoryManager.UserRepository.GetById(id);
    }

    public async Task<User> Add(User user)
    {
        var addedUser = await _repositoryManager.UserRepository.Add(user);
        await _repositoryManager.SaveAsync(); // שמירה על השינויים אחרי הוספת המשתמש
        return addedUser;
    }

    public async Task<User> Update(User user)
    {
        var updatedUser = await _repositoryManager.UserRepository.Update(user);
        await _repositoryManager.SaveAsync(); // שמירה על השינויים אחרי עדכון המשתמש
        return updatedUser;
    }

    public async Task<User?> Delete(int id)
    {
        var deletedUser = await _repositoryManager.UserRepository.Delete(id);
        await _repositoryManager.SaveAsync(); // שמירה על השינויים אחרי מחיקת המשתמש
        return deletedUser;
    }

    // פונקציה לאימות משתמש
    public async Task<User?> AuthenticateUser(string userName, string password)
    {
        return await _repositoryManager.UserRepository.AuthenticateUser(userName, password);
    }

    public async Task<User?> GetByUserName(string userName)
    {
        return await _repositoryManager.UserRepository.GetByUserName(userName);
    }

    public async Task<User?> GetByEmail(string email)
    {
        return await _repositoryManager.UserRepository.GetByEmail(email);
    }
}
