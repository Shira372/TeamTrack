using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TeamTrack.API.Models;
using TeamTrack.Core.IServices; // הוספנו את ה-Service שלך
using TeamTrack.Core.Entities; // הוספנו את ה-User entity
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace TeamTrack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService; // הוספנו את ה-UserService
        private readonly IConfiguration _configuration;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            // חיפוש משתמש מה-DB לפי שם משתמש
            var user = await _userService.AuthenticateUser(loginModel.UserName, loginModel.PasswordHash);

            if (user == null)
            {
                return Unauthorized("שם משתמש או סיסמה שגויים.");
            }

            // אם נמצא משתמש מתאים, ניצור JWT Token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWT:Key")));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("JWT:Issuer"),
                audience: _configuration.GetValue<string>("JWT:Audience"),
                claims: claims,
                expires: DateTime.Now.AddMinutes(60), // יכול להאריך את זמן התוקף לפי הצורך
                signingCredentials: signinCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new { Token = tokenString });
        }
    }
}
