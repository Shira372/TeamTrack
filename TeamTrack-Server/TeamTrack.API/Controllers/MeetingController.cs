using Microsoft.AspNetCore.Mvc;
using TeamTrack.Core.Entities;
using TeamTrack.Core.IServices;
using System.Threading.Tasks;
using TeamTrack.API.Models;
using AutoMapper;
using TeamTrack.Core.DTOs;

namespace TeamTrack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private readonly IMeetingService _meetingService;
        private readonly IUserService _userService; // להוסיף שירות משתמשים
        private readonly IMapper _mapper;

        public MeetingsController(IMeetingService meetingService, IUserService userService, IMapper mapper)
        {
            _meetingService = meetingService;
            _userService = userService;
            _mapper = mapper;
        }
        
        // GET: api/Meetings
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var meetings = await _meetingService.GetList();
            var meetingsDTO = _mapper.Map<IEnumerable<MeetingDTO>>(meetings);
            return Ok(meetingsDTO);
        }

        // GET api/Meetings/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var meeting = await _meetingService.GetById(id);
            var meetingDTO = _mapper.Map<MeetingDTO>(meeting);
            if (meeting == null)
            {
                return NotFound();
            }
            return Ok(meetingDTO);
        }

        // POST api/Meetings
        [HttpPost]
        public async Task<IActionResult> AddMeeting([FromBody] MeetingPostModel meeting)
        {
            var meetingToAdd=new Meeting() { MeetingName=meeting.MeetingName, CreatedByUserId =meeting.CreatedByUserId,TranscriptionLink =meeting.TranscriptionLink, SummaryLink =meeting.SummaryLink };
            // ודא שה- CreatedByUserId שנשלח מציין משתמש קיים במסד הנתונים
            var user = await _userService.GetById(meetingToAdd.CreatedByUserId ?? 0);

            if (user == null)
            {
                // החזר שגיאה אם המשתמש לא קיים
                return BadRequest("המשתמש לא קיים במסד הנתונים.");
            }

            // אם המשתמש קיים, המשך להוסיף את הישיבה
            var addedMeeting = await _meetingService.AddAsync(meetingToAdd);
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
