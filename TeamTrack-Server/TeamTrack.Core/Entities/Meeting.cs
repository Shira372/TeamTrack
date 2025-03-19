using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace TeamTrack.Core.Entities
{
    public class Meeting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // מספור אוטומטי
        public int Id { get; set; } // מזהה ישיבה

        public string? Name { get; set; } // שם הישיבה
        public User? CreatedByUser { get; set; } // הקשר למשתמש שיצר את הישיבה

        public int? CreatedByUserId { get; set; } // מזהה המשתמש שיצר את הישיבה

        public string? TranscriptionLink { get; set; } // קישור לתמלול בענן

        public string? SummaryLink { get; set; } // קישור לסיכום בענן

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow; // תאריך יצירה

        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow; // תאריך עדכון

        public List<User>? Users { get; set; } = new List<User>(); // קשר רבים לרבים עם משתמשים נוספים בישיבה
    }
}
