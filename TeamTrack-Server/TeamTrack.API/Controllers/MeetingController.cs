﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeamTrack.Core.Entities;
using TeamTrack.Core.IServices;
using TeamTrack.Core.DTOs;
using AutoMapper;
using TeamTrack.API.Models;
using System.Security.Claims;

namespace TeamTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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
            var result = new List<MeetingDTO>();

            foreach (var meeting in meetings)
                result.Add(await MapMeetingToDTO(meeting));

            return Ok(result);
        }

        [HttpGet("my")]
        public async Task<ActionResult> GetMyMeetings()
        {
            if (!TryGetUserId(out int userId))
                return Unauthorized("משתמש לא מזוהה");

            var meetings = await _meetingService.GetList();
            var myMeetings = meetings.Where(m => m.CreatedByUserId == userId).ToList();

            var result = new List<MeetingDTO>();
            foreach (var meeting in myMeetings)
                result.Add(await MapMeetingToDTO(meeting));

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var meeting = await _meetingService.GetById(id);
            if (meeting == null)
                return NotFound();

            return Ok(await MapMeetingToDTO(meeting));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MeetingPostModel model)
        {
            try
            {
                if (!TryGetUserId(out int userId))
                    return Unauthorized("משתמש לא מזוהה");

                var user = await _userService.GetById(userId);
                if (user == null)
                    return BadRequest("המשתמש לא קיים במסד הנתונים.");

                var meeting = new Meeting
                {
                    MeetingName = model.MeetingName,
                    CreatedByUserId = userId,
                    SummaryLink = model.SummaryLink,
                    TranscriptionLink = model.TranscriptionLink,
                    CreatedAt = DateTime.UtcNow
                };

                if (model.ParticipantIds?.Any() == true)
                {
                    var participants = new List<User>();
                    foreach (var id in model.ParticipantIds)
                    {
                        var participant = await _userService.GetById(id);
                        if (participant != null)
                            participants.Add(participant);
                    }
                    meeting.Users = participants;
                }

                var added = await _meetingService.AddAsync(meeting);
                return CreatedAtAction(nameof(Get), new { id = added.Id }, await MapMeetingToDTO(added));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה ביצירת פגישה");
                return StatusCode(500, "שגיאה פנימית בשרת");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MeetingPostModel model)
        {
            var existing = await _meetingService.GetById(id);
            if (existing == null)
                return NotFound("הפגישה לא נמצאה");

            existing.MeetingName = model.MeetingName;
            existing.TranscriptionLink = model.TranscriptionLink;
            existing.SummaryLink = model.SummaryLink;
            existing.UpdatedAt = DateTime.UtcNow;

            if (model.ParticipantIds?.Any() == true)
            {
                var participants = new List<User>();
                foreach (var userId in model.ParticipantIds)
                {
                    var participant = await _userService.GetById(userId);
                    if (participant != null)
                        participants.Add(participant);
                }
                existing.Users = participants;
            }
            else
            {
                existing.Users = new List<User>();
            }

            var updated = await _meetingService.UpdateAsync(existing);
            return Ok(await MapMeetingToDTO(updated));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _meetingService.DeleteAsync(id);
            if (!deleted)
                return NotFound("הפגישה לא קיימת");

            return Ok();
        }

        // ----------------- Private Helpers -----------------

        private async Task<MeetingDTO> MapMeetingToDTO(Meeting meeting)
        {
            var dto = _mapper.Map<MeetingDTO>(meeting);

            if (meeting.CreatedByUserId.HasValue)
            {
                var user = await _userService.GetById(meeting.CreatedByUserId.Value);
                dto.CreatedByUserFullName = user?.UserName ?? "לא ידוע";
            }

            dto.Participants = meeting.Users?
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Company = u.Company,
                    Role = u.Role,
                    Email = u.Email
                }).ToList();

            return dto;
        }

        private bool TryGetUserId(out int userId)
        {
            userId = 0;

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
                return false;

            return int.TryParse(claim.Value, out userId);
        }
    }
}
