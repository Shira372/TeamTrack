using Microsoft.AspNetCore.Mvc;
using TeamTrack.Core.Entities;
using TeamTrack.Core.IServices;
using System.Threading.Tasks;

namespace TeamTrack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private readonly IMeetingService _meetingService;
        private readonly IUserService _userService; // להוסיף שירות משתמשים

        public MeetingsController(IMeetingService meetingService, IUserService userService)
        {
            _meetingService = meetingService;
            _userService = userService;
        }

        // GET: api/Meetings
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var meetings = await _meetingService.GetList();
            return Ok(meetings);
        }

        // GET api/Meetings/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var meeting = await _meetingService.GetById(id);
            if (meeting == null)
            {
                return NotFound();
            }
            return Ok(meeting);
        }

        // POST api/Meetings
        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> AddMeeting([FromBody] Meeting meeting)
        {
            // ודא שה- CreatedByUserId שנשלח מציין משתמש קיים במסד הנתונים
            var user = await _userService.GetById(meeting.CreatedByUserId ?? 0);

            if (user == null)
            {
                // החזר שגיאה אם המשתמש לא קיים
                return BadRequest("המשתמש לא קיים במסד הנתונים.");
            }

            // אם המשתמש קיים, המשך להוסיף את הישיבה
            var addedMeeting = await _meetingService.AddAsync(meeting);
            return CreatedAtAction(nameof(Get), new { id = addedMeeting.Id }, addedMeeting);
        }


        // PUT api/Meetings/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Meeting meeting)
        {
            var updatedMeeting = await _meetingService.UpdateAsync(meeting);
            if (updatedMeeting == null)
            {
                return NotFound();
            }
            return Ok(updatedMeeting);
        }

        // DELETE api/Meetings/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _meetingService.DeleteAsync(id);
            return NoContent(); // החזרת תשובה ריקה לאחר מחיקה מוצלחת
        }
    }
}
