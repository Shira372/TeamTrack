using System;
using System.Collections.Generic;

namespace TeamTrack.Core.Entities
{
    public class Meeting
    {
        public int Id { get; set; }

        public string? MeetingName { get; set; }

        public int? CreatedByUserId { get; set; }

        public string? TranscriptionLink { get; set; }

        public string? SummaryLink { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
