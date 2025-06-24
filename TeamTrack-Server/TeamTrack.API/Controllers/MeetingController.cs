using Microsoft.AspNetCore.Mvc;
using TeamTrack.Core.Entities;
using TeamTrack.Core.IServices;
using TeamTrack.Core.DTOs;
using AutoMapper;
using TeamTrack.API.Models;

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

            var meetingsDTO = new List<MeetingDTO>();
            foreach (var meeting in meetings)
            {
                var dto = _mapper.Map<MeetingDTO>(meeting);

                if (meeting.CreatedByUserId.HasValue)
                {
                    var user = await _userService.GetById(meeting.CreatedByUserId.Value);
                    dto.CreatedByUserFullName = user?.FullName ?? "Unknown";
                }

                meetingsDTO.Add(dto);
            }

            return Ok(meetingsDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var meeting = await _meetingService.GetById(id);
            if (meeting == null)
                return NotFound();

            var meetingDTO = _mapper.Map<MeetingDTO>(meeting);

            if (meeting.CreatedByUserId.HasValue)
            {
                var user = await _userService.GetById(meeting.CreatedByUserId.Value);
                meetingDTO.CreatedByUserFullName = user?.FullName ?? "Unknown";
            }

            return Ok(meetingDTO);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MeetingPostModel meetingModel)
        {
            try
            {
                var userIdClaim = User.FindFirst("sub") ?? User.FindFirst("id") ?? User.FindFirst("UserId");
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                    return Unauthorized("משתמש לא מזוהה");

                var user = await _userService.GetById(userId);
                if (user == null)
                    return BadRequest("המשתמש לא קיים במסד הנתונים.");

                var meeting = new Meeting
                {
                    MeetingName = meetingModel.MeetingName,
                    CreatedByUserId = userId,
                    TranscriptionLink = meetingModel.TranscriptionLink,
                    SummaryLink = meetingModel.SummaryLink,
                    CreatedAt = DateTime.UtcNow
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
            if (id != meeting.Id)
                return BadRequest("ה־ID בפנייה שונה מה־ID של הפגישה");

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
