using AutoMapper;
using TeamTrack.Core.DTOs;
using TeamTrack.Core.Entities;

namespace TeamTrack.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>().ReverseMap();

            CreateMap<Meeting, MeetingDTO>()
                .ForMember(dest => dest.Participants, opt => opt.MapFrom(src => src.Users)) // מיפוי המשתתפים
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.MeetingName, opt => opt.MapFrom(src => src.MeetingName))
                .ForMember(dest => dest.CreatedByUserId, opt => opt.MapFrom(src => src.CreatedByUserId))
                .ForMember(dest => dest.TranscriptionLink, opt => opt.MapFrom(src => src.TranscriptionLink))
                .ForMember(dest => dest.SummaryLink, opt => opt.MapFrom(src => src.SummaryLink))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt))
                .ReverseMap();
        }
    }
}
