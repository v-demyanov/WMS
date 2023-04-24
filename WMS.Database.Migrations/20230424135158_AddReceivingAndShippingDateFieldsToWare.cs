using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class AddReceivingAndShippingDateFieldsToWare : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ReceivingDate",
                table: "Wares",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ShippingDate",
                table: "Wares",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "6A2BFDF0CDDD82533AF32C21A18217E1CFB0974AC02FD779C0785A608D904B92", "3F890434F5D4FB9630E38DE04BCFC2CD" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceivingDate",
                table: "Wares");

            migrationBuilder.DropColumn(
                name: "ShippingDate",
                table: "Wares");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "5B3184A4B69FCE80F9C3D9715E1D6DCC7072DB25C4E64795774B4DB10D5370A1", "2B14B35FC3E63F2D3E07DE9F3A2B2FC5" });
        }
    }
}
