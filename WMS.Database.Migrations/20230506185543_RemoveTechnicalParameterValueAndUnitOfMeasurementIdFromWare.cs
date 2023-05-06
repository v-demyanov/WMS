using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class RemoveTechnicalParameterValueAndUnitOfMeasurementIdFromWare : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wares_UnitsOfMeasurement_UnitOfMeasurementId",
                table: "Wares");

            migrationBuilder.DropIndex(
                name: "IX_Wares_UnitOfMeasurementId",
                table: "Wares");

            migrationBuilder.DropColumn(
                name: "TechnicalParameterValue",
                table: "Wares");

            migrationBuilder.DropColumn(
                name: "UnitOfMeasurementId",
                table: "Wares");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "F1486D74197BD91710B65408BF017EDF18F66373919DBA7207683B8ECCB86C6A", "D45DAEBA2226F2F374F80D19F79413DC" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TechnicalParameterValue",
                table: "Wares",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "UnitOfMeasurementId",
                table: "Wares",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "803AEF2AEE76C26526B806435931C783B357D8C118B5A26F620ABC22EA1619BA", "B4CF493B142AD8AC51DD0DC9125AA56E" });

            migrationBuilder.CreateIndex(
                name: "IX_Wares_UnitOfMeasurementId",
                table: "Wares",
                column: "UnitOfMeasurementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wares_UnitsOfMeasurement_UnitOfMeasurementId",
                table: "Wares",
                column: "UnitOfMeasurementId",
                principalTable: "UnitsOfMeasurement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
