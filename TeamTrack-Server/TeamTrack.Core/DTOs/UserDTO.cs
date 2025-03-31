using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamTrack.Core.Entities;

namespace TeamTrack.Core.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; } // מזהה משתמש

        public string? UserName { get; set; } // שם משתמש

        public string? PasswordHash { get; set; } // סיסמה (מוצפנת)

        public string? Company { get; set; } // חברה

        //public string? Role { get; set; } // תפקיד

        public string? Email { get; set; } // מייל
    }
}
