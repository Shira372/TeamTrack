using Microsoft.AspNetCore.Mvc;
using TeamTrack.Core.Entities;
using TeamTrack.Core.IServices;
using TeamTrack.API.Models;
using TeamTrack.Core.DTOs;
using AutoMapper;

namespace TeamTrack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private readonly IMeetingService _meetingService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<MeetingsController> _logger;

        public MeetingsController(
            IMeetingService meetingService,
            IUserService userService,
            IMapper mapper,
            ILogger<MeetingsController> logger)
        {
            _meetingService = meetingService;
            _userService = userService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var meetings = await _meetingService.GetList();
            var meetingsDTO = _mapper.Map<IEnumerable<MeetingDTO>>(meetings);
            return Ok(meetingsDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var meeting = await _meetingService.GetById(id);
            if (meeting == null)
                return NotFound();

            var meetingDTO = _mapper.Map<MeetingDTO>(meeting);
            return Ok(meetingDTO);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MeetingPostModel meetingModel)
        {
            try
            {
                var user = await _userService.GetById(meetingModel.CreatedByUserId ?? 0);
                if (user == null)
                    return BadRequest("המשתמש לא קיים במסד הנתונים.");

                // ✅ המרה ידנית של MeetingPostModel ל-Meeting
                var meeting = new Meeting
                {
                    MeetingName = meetingModel.MeetingName,
                    CreatedByUserId = meetingModel.CreatedByUserId,
                    TranscriptionLink = meetingModel.TranscriptionLink,
                    SummaryLink = meetingModel.SummaryLink
                };

                var added = await _meetingService.AddAsync(meeting);
                return CreatedAtAction(nameof(Get), new { id = added.Id }, added);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה ביצירת פגישה");
                return StatusCode(500, "שגיאה פנימית בשרת");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Meeting meeting)
        {
            var updated = await _meetingService.UpdateAsync(meeting);
            if (updated == null)
                return NotFound("הפגישה לא נמצאה");

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _meetingService.DeleteAsync(id);
            if (!deleted)
                return NotFound("הפגישה לא קיימת");

            return Ok();
        }
    }
}
