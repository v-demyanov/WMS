using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class RelinkTenants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Individuals_Tenants_TenantId",
                table: "Individuals");

            migrationBuilder.DropForeignKey(
                name: "FK_LegalEntities_Tenants_TenantId",
                table: "LegalEntities");

            migrationBuilder.DropForeignKey(
                name: "FK_Wares_Tenants_TenantId",
                table: "Wares");

            migrationBuilder.DropTable(
                name: "Tenants");

            migrationBuilder.DropIndex(
                name: "IX_Wares_TenantId",
                table: "Wares");

            migrationBuilder.DropIndex(
                name: "IX_LegalEntities_TenantId",
                table: "LegalEntities");

            migrationBuilder.DropIndex(
                name: "IX_Individuals_TenantId",
                table: "Individuals");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Wares");

            migrationBuilder.RenameColumn(
                name: "TenantId",
                table: "LegalEntities",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "TenantId",
                table: "Individuals",
                newName: "Type");

            migrationBuilder.AddColumn<int>(
                name: "IndividualId",
                table: "Wares",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LegalEntityId",
                table: "Wares",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "LegalEntities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "LegalEntities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Individuals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Individuals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Wares_IndividualId",
                table: "Wares",
                column: "IndividualId");

            migrationBuilder.CreateIndex(
                name: "IX_Wares_LegalEntityId",
                table: "Wares",
                column: "LegalEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wares_Individuals_IndividualId",
                table: "Wares",
                column: "IndividualId",
                principalTable: "Individuals",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Wares_LegalEntities_LegalEntityId",
                table: "Wares",
                column: "LegalEntityId",
                principalTable: "LegalEntities",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wares_Individuals_IndividualId",
                table: "Wares");

            migrationBuilder.DropForeignKey(
                name: "FK_Wares_LegalEntities_LegalEntityId",
                table: "Wares");

            migrationBuilder.DropIndex(
                name: "IX_Wares_IndividualId",
                table: "Wares");

            migrationBuilder.DropIndex(
                name: "IX_Wares_LegalEntityId",
                table: "Wares");

            migrationBuilder.DropColumn(
                name: "IndividualId",
                table: "Wares");

            migrationBuilder.DropColumn(
                name: "LegalEntityId",
                table: "Wares");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "LegalEntities");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "LegalEntities");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Individuals");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Individuals");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "LegalEntities",
                newName: "TenantId");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Individuals",
                newName: "TenantId");

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Wares",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Tenants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tenants", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Wares_TenantId",
                table: "Wares",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_LegalEntities_TenantId",
                table: "LegalEntities",
                column: "TenantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Individuals_TenantId",
                table: "Individuals",
                column: "TenantId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Individuals_Tenants_TenantId",
                table: "Individuals",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LegalEntities_Tenants_TenantId",
                table: "LegalEntities",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Wares_Tenants_TenantId",
                table: "Wares",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
