using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class SetOnAddressDeleteNoActionToWareEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wares_Addresses_AddressId",
                table: "Wares");

            migrationBuilder.AddForeignKey(
                name: "FK_Wares_Addresses_AddressId",
                table: "Wares",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wares_Addresses_AddressId",
                table: "Wares");

            migrationBuilder.AddForeignKey(
                name: "FK_Wares_Addresses_AddressId",
                table: "Wares",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
