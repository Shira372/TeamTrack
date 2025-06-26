using TeamTrack.Core.Entities;

namespace TeamTrack.API.Models
{
    public class MeetingPostModel
    {
        public string? MeetingName { get; set; }
        public string? TranscriptionLink { get; set; }
        public string? SummaryLink { get; set; }
        public List<int>? ParticipantIds { get; set; }  
    }

}
