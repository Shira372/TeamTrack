namespace TeamTrack.API.Models
{
    public class LoginModel
    {
        public string UserName { get; set; } // שם המשתמש
        public string PasswordHash { get; set; } // הסיסמה (מוצפנת)
    }
}
