using TeamTrack.Core.DTOs;
using TeamTrack.Core.Entities;

namespace TeamTrack.Core
{
    public class Mapping
    {
        public UserDTO MapToUserDTO(User user)
        {
            return new UserDTO { Id=user.Id, UserName = user.UserName, PasswordHash = user.PasswordHash, Company = user.Company, Email = user.Email };
        }
        public MeetingDTO MapToMeetingDTO(Meeting meeting)
        {
            return new MeetingDTO { Id = meeting.Id, MeetingName = meeting.MeetingName, CreatedByUserId=meeting.CreatedByUserId, TranscriptionLink=meeting.TranscriptionLink, SummaryLink=meeting.SummaryLink};
        }

    }
}