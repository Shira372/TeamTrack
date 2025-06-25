namespace TeamTrack.Core.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string? UserName { get; set; }

        public string? Company { get; set; }

        public string? Role { get; set; }

        public string? Email { get; set; }

        public string? FullName => UserName ?? "לא ידוע";
    }
}
