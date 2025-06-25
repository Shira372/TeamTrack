using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace TeamTrack.Core.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string? UserName { get; set; }

        public string? PasswordHash { get; set; }

        public string? Company { get; set; }

        public string? Role { get; set; }

        public string? Email { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

        public List<Meeting>? Meetings { get; set; } = new List<Meeting>();

        public List<Meeting>? MeetingsUserCreate { get; set; } = new List<Meeting>();

        [NotMapped]
        public string FullName => UserName ?? "לא ידוע";
    }
}
