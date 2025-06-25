using System;
using System.Collections.Generic;

namespace TeamTrack.Core.DTOs
{
    public class MeetingDTO
    {
        public int Id { get; set; }

        public string? MeetingName { get; set; }

        public int? CreatedByUserId { get; set; }

        public string? CreatedByUserFullName { get; set; }

        public string? TranscriptionLink { get; set; }

        public string? SummaryLink { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public List<UserDTO>? Participants { get; set; }
    }
}
