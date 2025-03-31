using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using TeamTrack.Core.DTOs;
using TeamTrack.Core.Entities;


namespace TeamTrack.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User,UserDTO>().ReverseMap();
            CreateMap<Meeting, MeetingDTO>().ReverseMap();
        }
    }
}
