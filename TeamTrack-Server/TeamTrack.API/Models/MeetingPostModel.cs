using TeamTrack.Core.Entities;

namespace TeamTrack.API.Models
{
    public class MeetingPostModel
    {
        public string? MeetingName { get; set; }            // שם הפגישה

        public string? TranscriptionLink { get; set; }      // קישור לתמלול

        public string? SummaryLink { get; set; }            // קישור לסיכום
    }
}
