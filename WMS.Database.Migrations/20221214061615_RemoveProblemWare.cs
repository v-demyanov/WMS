using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class RemoveProblemWare : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WareProblems");

            migrationBuilder.AddColumn<int>(
                name: "TargetAddressId",
                table: "Problems",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WareId",
                table: "Problems",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Problems_TargetAddressId",
                table: "Problems",
                column: "TargetAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_WareId",
                table: "Problems",
                column: "WareId");

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Addresses_TargetAddressId",
                table: "Problems",
                column: "TargetAddressId",
                principalTable: "Addresses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Wares_WareId",
                table: "Problems",
                column: "WareId",
                principalTable: "Wares",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Addresses_TargetAddressId",
                table: "Problems");

            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Wares_WareId",
                table: "Problems");

            migrationBuilder.DropIndex(
                name: "IX_Problems_TargetAddressId",
                table: "Problems");

            migrationBuilder.DropIndex(
                name: "IX_Problems_WareId",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "TargetAddressId",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "WareId",
                table: "Problems");

            migrationBuilder.CreateTable(
                name: "WareProblems",
                columns: table => new
                {
                    ProblemId = table.Column<int>(type: "int", nullable: false),
                    WareId = table.Column<int>(type: "int", nullable: false),
                    TargetAddressId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WareProblems", x => new { x.ProblemId, x.WareId });
                    table.ForeignKey(
                        name: "FK_WareProblems_Addresses_TargetAddressId",
                        column: x => x.TargetAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_WareProblems_Problems_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WareProblems_Wares_WareId",
                        column: x => x.WareId,
                        principalTable: "Wares",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WareProblems_TargetAddressId",
                table: "WareProblems",
                column: "TargetAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_WareProblems_WareId",
                table: "WareProblems",
                column: "WareId");
        }
    }
}
