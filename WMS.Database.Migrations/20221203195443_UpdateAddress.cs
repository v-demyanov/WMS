using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class UpdateAddress : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Racks_RackId",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_VerticalSections_VerticalSectionId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_RackId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_VerticalSectionId",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "RackId",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "VerticalSectionId",
                table: "Addresses");

            migrationBuilder.AddColumn<int>(
                name: "Index",
                table: "VerticalSections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Index",
                table: "Shelfs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Index",
                table: "Racks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_VerticalSections_Index_RackId",
                table: "VerticalSections",
                columns: new[] { "Index", "RackId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Shelfs_Index_VerticalSectionId",
                table: "Shelfs",
                columns: new[] { "Index", "VerticalSectionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Racks_Index_AreaId",
                table: "Racks",
                columns: new[] { "Index", "AreaId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses",
                column: "ShelfId",
                unique: true,
                filter: "[ShelfId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_VerticalSections_Index_RackId",
                table: "VerticalSections");

            migrationBuilder.DropIndex(
                name: "IX_Shelfs_Index_VerticalSectionId",
                table: "Shelfs");

            migrationBuilder.DropIndex(
                name: "IX_Racks_Index_AreaId",
                table: "Racks");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "Index",
                table: "VerticalSections");

            migrationBuilder.DropColumn(
                name: "Index",
                table: "Shelfs");

            migrationBuilder.DropColumn(
                name: "Index",
                table: "Racks");

            migrationBuilder.AddColumn<int>(
                name: "RackId",
                table: "Addresses",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VerticalSectionId",
                table: "Addresses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_RackId",
                table: "Addresses",
                column: "RackId");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_ShelfId",
                table: "Addresses",
                column: "ShelfId");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_VerticalSectionId",
                table: "Addresses",
                column: "VerticalSectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Racks_RackId",
                table: "Addresses",
                column: "RackId",
                principalTable: "Racks",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_VerticalSections_VerticalSectionId",
                table: "Addresses",
                column: "VerticalSectionId",
                principalTable: "VerticalSections",
                principalColumn: "Id");
        }
    }
}
