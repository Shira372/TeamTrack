namespace TeamTrack.API.Models
{
    public class UserPostModel
    {
        public string? UserName { get; set; } // שם משתמש
        public string? PasswordHash { get; set; } // סיסמה (מוצפנת)
        public string? Company { get; set; } // חברה
        public string? Role { get; set; } // תפקיד
        public string? Email { get; set; } // מייל
    }
}
