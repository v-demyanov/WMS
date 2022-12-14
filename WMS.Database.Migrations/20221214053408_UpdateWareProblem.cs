using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class UpdateWareProblem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TargetAddressId",
                table: "WareProblems",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WareProblems_TargetAddressId",
                table: "WareProblems",
                column: "TargetAddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_WareProblems_Addresses_TargetAddressId",
                table: "WareProblems",
                column: "TargetAddressId",
                principalTable: "Addresses",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WareProblems_Addresses_TargetAddressId",
                table: "WareProblems");

            migrationBuilder.DropIndex(
                name: "IX_WareProblems_TargetAddressId",
                table: "WareProblems");

            migrationBuilder.DropColumn(
                name: "TargetAddressId",
                table: "WareProblems");
        }
    }
}
