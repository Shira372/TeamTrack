using TeamTrack.Core.Entities;

namespace TeamTrack.API.Models
{
    public class MeetingPostModel
    {
        public string? MeetingName { get; set; } // שם הישיבה
        public int? CreatedByUserId { get; set; } // מזהה המשתמש שיצר את הישיבה

        public string? TranscriptionLink { get; set; } // קישור לתמלול בענן

        public string? SummaryLink { get; set; } // קישור לסיכום בענן
    }
}

