using Microsoft.AspNetCore.Mvc;
using TeamTrack.Core.Entities;
using TeamTrack.Core.IServices;
using System.Threading.Tasks;

namespace TeamTrack.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/<UsersController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var users = await _userService.GetList();
            return Ok(users);
        }

        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var user = await _userService.GetById(id);
            if (user == null)
            {
                return NotFound(); // אם המשתמש לא נמצא, מחזיר 404
            }
            return Ok(user);
        }

        // POST api/<UsersController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] User user)
        {
            // לפני יצירת משתמש, ודא שהמשתמש קיים במסד הנתונים (במקרה הצורך עם CreatedByUserId)
            var existingUser = await _userService.GetById(user.Id);
            if (existingUser == null)
            {
                return BadRequest("המשתמש לא קיים במסד הנתונים.");
            }

            var newUser = await _userService.Add(user);
            return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser); // יצירת משתמש חדש ויצירת URL להתייחסות אליו
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] User user)
        {
            // לפני עדכון, ודא שהמשתמש קיים במסד הנתונים
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
            // לפני מחיקה, ודא שהמשתמש קיים
            var existingUser = await _userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound("המשתמש לא קיים במסד הנתונים.");
            }

            var result = await _userService.Delete(id);
            return Ok(); // החזרת תשובה לאחר מחיקה מוצלחת
        }
    }
}
