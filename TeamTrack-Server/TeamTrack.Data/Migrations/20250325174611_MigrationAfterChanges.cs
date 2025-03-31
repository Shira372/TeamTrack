using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamTrack.Data.Migrations
{
    /// <inheritdoc />
    public partial class MigrationAfterChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "UserName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Meetings",
                newName: "MeetingName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "MeetingName",
                table: "Meetings",
                newName: "Name");
        }
    }
}
