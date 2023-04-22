using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class AddUsersSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "Email", "FirstName", "LastName", "Password", "RefreshToken", "RefreshTokenSalt", "Role", "Salt" },
                values: new object[] { 1, null, "system.wms@outlook.com", "Vladislav", "Demyanov", "5B3184A4B69FCE80F9C3D9715E1D6DCC7072DB25C4E64795774B4DB10D5370A1", null, null, 0, "2B14B35FC3E63F2D3E07DE9F3A2B2FC5" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
