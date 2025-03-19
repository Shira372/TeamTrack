using System;
using System.Threading.Tasks;

namespace TeamTrack.Core.IRepositories
{
    public interface IRepositoryManager
    {
        IUserRepository UserRepository { get; }
        IMeetingRepository MeetingRepository { get; }

        Task SaveAsync();  // שמירה של כל השינויים במאגרים
    }
}
