using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class RemoveAreaFromAddressAndMakeShelfRequired : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Areas_AreaId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_AreaId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "AreaId",
                table: "Addresses");

            migrationBuilder.AlterColumn<int>(
                name: "ShelfId",
                table: "Addresses",
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
                values: new object[] { "89C374875D6B7BF5F0178545074F5AD3C215C7C03EE9E8DCF1E362D74ADE52BC", "333607AB53A099821136616DBDD9D72A" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses",
                column: "ShelfId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses");

            migrationBuilder.AlterColumn<int>(
                name: "ShelfId",
                table: "Addresses",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "AreaId",
                table: "Addresses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "F1486D74197BD91710B65408BF017EDF18F66373919DBA7207683B8ECCB86C6A", "D45DAEBA2226F2F374F80D19F79413DC" });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_AreaId",
                table: "Addresses",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses",
                column: "ShelfId",
                unique: true,
                filter: "[ShelfId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Areas_AreaId",
                table: "Addresses",
                column: "AreaId",
                principalTable: "Areas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
