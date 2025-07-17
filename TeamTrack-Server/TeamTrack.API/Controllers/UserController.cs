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
using AutoMapper;

namespace TeamTrack.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, IConfiguration configuration, IMapper mapper, ILogger<UsersController> logger)
        {
            _userService = userService;
            _configuration = configuration;
            _mapper = mapper;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<ActionResult> Signup([FromBody] UserPostModel user)
        {
            try
            {
                _logger.LogInformation($"Signup: {user.UserName}, {user.Email}, {user.Company}");
                _logger.LogInformation($"Received Role in Signup: {user.Role}");

                if (await _userService.GetByUserName(user.UserName) != null)
                    return BadRequest("שם המשתמש כבר קיים.");

                if (await _userService.GetByEmail(user.Email) != null)
                    return BadRequest("האימייל כבר נמצא במערכת.");

                var newUser = new User
                {
                    UserName = user.UserName,
                    PasswordHash = user.PasswordHash,
                    Company = user.Company,
                    Email = user.Email,
                    Role = string.IsNullOrEmpty(user.Role) ? "User" : user.Role
                };

                var createdUser = await _userService.Add(newUser);
                var token = GenerateJwtToken(createdUser);

                var userDto = _mapper.Map<UserDTO>(createdUser);

                return Ok(new
                {
                    Token = token,
                    User = userDto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בהרשמה");
                return StatusCode(500, "שגיאה פנימית בשרת.");
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel login)
        {
            try
            {
                _logger.LogInformation($"Login attempt: {login.UserName}");

                var user = await _userService.AuthenticateUser(login.UserName, login.PasswordHash);
                if (user == null)
                    return Unauthorized("שם משתמש או סיסמה שגויים.");

                var token = GenerateJwtToken(user);
                var userDto = _mapper.Map<UserDTO>(user);

                return Ok(new
                {
                    Token = token,
                    User = userDto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה במהלך התחברות");
                return StatusCode(500, "שגיאה פנימית בשרת.");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var users = await _userService.GetList();
            var usersDto = _mapper.Map<IEnumerable<UserDTO>>(users);
            return Ok(usersDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var user = await _userService.GetById(id);
            if (user == null)
                return NotFound();

            var userDto = _mapper.Map<UserDTO>(user);
            return Ok(userDto);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] UserPostModel user)
        {
            var userToAdd = new User
            {
                UserName = user.UserName,
                PasswordHash = user.PasswordHash,
                Company = user.Company,
                Role = user.Role ?? "User",
                Email = user.Email
            };

            var newUser = await _userService.Add(userToAdd);
            var userDto = _mapper.Map<UserDTO>(newUser);
            return CreatedAtAction(nameof(Get), new { id = userDto.Id }, userDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> Put(int id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                user.Id = id;
            }

            var existing = await _userService.GetById(id);
            if (existing == null)
                return NotFound("המשתמש לא קיים.");

            var updated = await _userService.Update(user);
            var userDto = _mapper.Map<UserDTO>(updated);
            return Ok(userDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _userService.GetById(id);
            if (existing == null)
                return NotFound("המשתמש לא קיים.");

            await _userService.Delete(id);
            return Ok();
        }
    }
}
