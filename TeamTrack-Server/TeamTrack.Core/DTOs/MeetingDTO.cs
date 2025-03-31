using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamTrack.Core.Entities;

namespace TeamTrack.Core.DTOs
{
    public class MeetingDTO
    {
        public int Id { get; set; } // מזהה ישיבה

        public string? MeetingName { get; set; } // שם הישיבה

        public int? CreatedByUserId { get; set; } // מזהה המשתמש שיצר את הישיבה

        public string? TranscriptionLink { get; set; } // קישור לתמלול בענן

        public string? SummaryLink { get; set; } // קישור לסיכום בענן
    }
}
