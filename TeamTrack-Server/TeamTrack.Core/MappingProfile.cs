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
            CreateMap<Meeting, MeetingDTO>().ReverseMap();
        }
    }
}
