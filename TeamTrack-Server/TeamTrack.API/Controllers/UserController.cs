using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TeamTrack.API.Models;
using TeamTrack.Core.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using TeamTrack.Core.DTOs;
using TeamTrack.Core.Entities;
using AutoMapper; // חשוב להוסיף את ה-namespace של AutoMapper

namespace TeamTrack.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper; // הגדרת ה-Mapper

        public UsersController(IUserService userService, IConfiguration configuration, IMapper mapper)
        {
            _userService = userService;
            _configuration = configuration;
            _mapper = mapper;
        }

        // פונקציה להרשמה (Signup)
        [HttpPost("signup")]
        public async Task<ActionResult> Signup([FromBody] UserPostModel user)
        {
            var existingUser = await _userService.GetByUserName(user.UserName);
            if (existingUser != null)
            {
                return BadRequest("שם המשתמש כבר קיים.");
            }

            var existingEmail = await _userService.GetByEmail(user.Email);
            if (existingEmail != null)
            {
                return BadRequest("האימייל כבר נמצא במערכת.");
            }

            var newUser = new User()
            {
                UserName = user.UserName,
                PasswordHash = user.PasswordHash, // שים לב, יש להחסין סיסמאות בצורה מאובטחת
                Company = user.Company,
                Email = user.Email,
                Role = "User" // תפקיד ברירת מחדל
            };

            var createdUser = await _userService.Add(newUser);

            return CreatedAtAction(nameof(Get), new { id = createdUser.Id }, createdUser);
        }

        // פונקציה לכניסת משתמש (Login)
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel login)
        {
            var user = await _userService.AuthenticateUser(login.UserName, login.PasswordHash);
            if (user == null)
            {
                return Unauthorized("שם משתמש או סיסמה שגויים.");
            }

            var token = GenerateJwtToken(user);

            return Ok(new { Token = token });
        }

        // פונקציה ליצירת JWT Token
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // GET: api/<UsersController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var users = await _userService.GetList();
            var usersDTO = _mapper.Map<IEnumerable<UserDTO>>(users); // שימוש ב-Mapper להמיר ל-DTO
            return Ok(usersDTO);
        }

        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var user = await _userService.GetById(id);
            var userDTO = _mapper.Map<UserDTO>(user); // שימוש ב-Mapper להמיר ל-DTO
            if (user == null)
            {
                return NotFound();
            }
            return Ok(userDTO);
        }

        // POST api/<UsersController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] UserPostModel user)
        {
            var userToAdd = new User()
            {
                UserName = user.UserName,
                PasswordHash = user.PasswordHash,
                Company = user.Company,
                Role = user.Role,
                Email = user.Email
            };

            var existingUser = await _userService.GetById(userToAdd.Id);
            if (existingUser == null)
            {
                return BadRequest("המשתמש לא קיים במסד הנתונים.");
            }

            var newUser = await _userService.Add(userToAdd);
            return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser);
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] User user)
        {
            var existingUser = await _userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound("המשתמש לא קיים במסד הנתונים.");
            }

            var updatedUser = await _userService.Update(user);
            return Ok(updatedUser);
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var existingUser = await _userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound("המשתמש לא קיים במסד הנתונים.");
            }

            var result = await _userService.Delete(id);
            return Ok();
        }
    }
}
