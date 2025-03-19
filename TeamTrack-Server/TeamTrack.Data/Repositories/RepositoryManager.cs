using TeamTrack.Core.IRepositories;
using System.Threading.Tasks;

namespace TeamTrack.Data
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly UserRepository _userRepository;
        private readonly MeetingRepository _meetingRepository;
        private readonly DataContext _context;

        public RepositoryManager(DataContext context)
        {
            _context = context;
            _userRepository = new UserRepository(_context);
            _meetingRepository = new MeetingRepository(_context);
        }

        public IUserRepository UserRepository => _userRepository;
        public IMeetingRepository MeetingRepository => _meetingRepository;

        // שמירה כאן, כדי לשמור את השינויים
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
