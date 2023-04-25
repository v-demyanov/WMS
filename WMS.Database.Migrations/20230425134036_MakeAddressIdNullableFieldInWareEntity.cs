using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class MakeAddressIdNullableFieldInWareEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Wares_AddressId",
                table: "Wares");

            migrationBuilder.AlterColumn<int>(
                name: "AddressId",
                table: "Wares",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "EB205B498A93752944C57C97054A2B9C88B51E92EB603479267DAC70603E2BC0", "8C7D10F8E2A138A001C9C6CDD26D2733" });

            migrationBuilder.CreateIndex(
                name: "IX_Wares_AddressId",
                table: "Wares",
                column: "AddressId",
                unique: true,
                filter: "[AddressId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Wares_AddressId",
                table: "Wares");

            migrationBuilder.AlterColumn<int>(
                name: "AddressId",
                table: "Wares",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "DB71A5CF7149FD727F929BD931CC904CE4FC65A1AF814BC1BCE557C38689ECBB", "A7FD2F406EBD94A44A06BC4D07D20DC0" });

            migrationBuilder.CreateIndex(
                name: "IX_Wares_AddressId",
                table: "Wares",
                column: "AddressId",
                unique: true);
        }
    }
}
