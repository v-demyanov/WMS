using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class DeleteAddressEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Addresses_TargetAddressId",
                table: "Problems");

            migrationBuilder.DropForeignKey(
                name: "FK_Wares_Addresses_AddressId",
                table: "Wares");

            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Wares_AddressId",
                table: "Wares");

            migrationBuilder.RenameColumn(
                name: "AddressId",
                table: "Wares",
                newName: "ShelfId");

            migrationBuilder.RenameColumn(
                name: "TargetAddressId",
                table: "Problems",
                newName: "TargetShelfId");

            migrationBuilder.RenameIndex(
                name: "IX_Problems_TargetAddressId",
                table: "Problems",
                newName: "IX_Problems_TargetShelfId");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "8B166ECDF0558C4BB2456CF4FDBE56EB2D6C9304641DEC1941A3D09DE49AB29C", "AABF5E268BB0C455F734AD666789C2F6" });

            migrationBuilder.CreateIndex(
                name: "IX_Wares_ShelfId",
                table: "Wares",
                column: "ShelfId",
                unique: true,
                filter: "[ShelfId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Shelfs_TargetShelfId",
                table: "Problems",
                column: "TargetShelfId",
                principalTable: "Shelfs",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Wares_Shelfs_ShelfId",
                table: "Wares",
                column: "ShelfId",
                principalTable: "Shelfs",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Shelfs_TargetShelfId",
                table: "Problems");

            migrationBuilder.DropForeignKey(
                name: "FK_Wares_Shelfs_ShelfId",
                table: "Wares");

            migrationBuilder.DropIndex(
                name: "IX_Wares_ShelfId",
                table: "Wares");

            migrationBuilder.RenameColumn(
                name: "ShelfId",
                table: "Wares",
                newName: "AddressId");

            migrationBuilder.RenameColumn(
                name: "TargetShelfId",
                table: "Problems",
                newName: "TargetAddressId");

            migrationBuilder.RenameIndex(
                name: "IX_Problems_TargetShelfId",
                table: "Problems",
                newName: "IX_Problems_TargetAddressId");

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShelfId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Addresses_Shelfs_ShelfId",
                        column: x => x.ShelfId,
                        principalTable: "Shelfs",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "89C374875D6B7BF5F0178545074F5AD3C215C7C03EE9E8DCF1E362D74ADE52BC", "333607AB53A099821136616DBDD9D72A" });

            migrationBuilder.CreateIndex(
                name: "IX_Wares_AddressId",
                table: "Wares",
                column: "AddressId",
                unique: true,
                filter: "[AddressId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses",
                column: "ShelfId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Addresses_TargetAddressId",
                table: "Problems",
                column: "TargetAddressId",
                principalTable: "Addresses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Wares_Addresses_AddressId",
                table: "Wares",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id");
        }
    }
}
