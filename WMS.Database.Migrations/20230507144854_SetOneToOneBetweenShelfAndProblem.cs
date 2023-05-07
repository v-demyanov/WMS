using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class SetOneToOneBetweenShelfAndProblem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Problems_TargetShelfId",
                table: "Problems");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "DF3D474BDED6CA3D7103DFBD577B0E8254BB3A9E9630D1BA3735136A2F01058C", "6C88CFDA211D8008BA36BA421A2B6026" });

            migrationBuilder.CreateIndex(
                name: "IX_Problems_TargetShelfId",
                table: "Problems",
                column: "TargetShelfId",
                unique: true,
                filter: "[TargetShelfId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Problems_TargetShelfId",
                table: "Problems");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "8B166ECDF0558C4BB2456CF4FDBE56EB2D6C9304641DEC1941A3D09DE49AB29C", "AABF5E268BB0C455F734AD666789C2F6" });

            migrationBuilder.CreateIndex(
                name: "IX_Problems_TargetShelfId",
                table: "Problems",
                column: "TargetShelfId");
        }
    }
}
