using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class AddStatusFieldToWare : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Wares",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "DB71A5CF7149FD727F929BD931CC904CE4FC65A1AF814BC1BCE557C38689ECBB", "A7FD2F406EBD94A44A06BC4D07D20DC0" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Wares");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "6A2BFDF0CDDD82533AF32C21A18217E1CFB0974AC02FD779C0785A608D904B92", "3F890434F5D4FB9630E38DE04BCFC2CD" });
        }
    }
}
