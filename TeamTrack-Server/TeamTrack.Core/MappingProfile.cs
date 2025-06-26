using AutoMapper;
using TeamTrack.Core.DTOs;
using TeamTrack.Core.Entities;

namespace TeamTrack.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.UserName)) // UserName במקום FullName
                .ReverseMap();

            CreateMap<Meeting, MeetingDTO>()
                .ForMember(dest => dest.Participants, opt => opt.MapFrom(src => src.Users))
                .ForMember(dest => dest.CreatedByUserFullName, opt => opt.MapFrom(src => src.CreatedByUser != null ? src.CreatedByUser.UserName : "Unknown"))
                .ReverseMap();
        }
    }

}
