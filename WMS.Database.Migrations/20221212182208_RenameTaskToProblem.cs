using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WMS.Database.Migrations
{
    public partial class RenameTaskToProblem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Tasks_TaskId",
                table: "Comments");

            migrationBuilder.DropTable(
                name: "WareTasks");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.RenameColumn(
                name: "TaskId",
                table: "Comments",
                newName: "ProblemId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_TaskId",
                table: "Comments",
                newName: "IX_Comments_ProblemId");

            migrationBuilder.CreateTable(
                name: "Problems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdateDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    PerformerId = table.Column<int>(type: "int", nullable: true),
                    ParentProblemId = table.Column<int>(type: "int", nullable: true),
                    AuthorId = table.Column<int>(type: "int", nullable: false),
                    AuditorId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Problems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Problems_Problems_ParentProblemId",
                        column: x => x.ParentProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Problems_Users_AuditorId",
                        column: x => x.AuditorId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Problems_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Problems_Users_PerformerId",
                        column: x => x.PerformerId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "WareProblems",
                columns: table => new
                {
                    WareId = table.Column<int>(type: "int", nullable: false),
                    ProblemId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WareProblems", x => new { x.ProblemId, x.WareId });
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
                name: "IX_Problems_AuditorId",
                table: "Problems",
                column: "AuditorId");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_AuthorId",
                table: "Problems",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_ParentProblemId",
                table: "Problems",
                column: "ParentProblemId");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_PerformerId",
                table: "Problems",
                column: "PerformerId");

            migrationBuilder.CreateIndex(
                name: "IX_WareProblems_WareId",
                table: "WareProblems",
                column: "WareId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Problems_ProblemId",
                table: "Comments",
                column: "ProblemId",
                principalTable: "Problems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Problems_ProblemId",
                table: "Comments");

            migrationBuilder.DropTable(
                name: "WareProblems");

            migrationBuilder.DropTable(
                name: "Problems");

            migrationBuilder.RenameColumn(
                name: "ProblemId",
                table: "Comments",
                newName: "TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_ProblemId",
                table: "Comments",
                newName: "IX_Comments_TaskId");

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AuditorId = table.Column<int>(type: "int", nullable: true),
                    AuthorId = table.Column<int>(type: "int", nullable: false),
                    ParentTaskId = table.Column<int>(type: "int", nullable: true),
                    PerformerId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdateDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tasks_Tasks_ParentTaskId",
                        column: x => x.ParentTaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tasks_Users_AuditorId",
                        column: x => x.AuditorId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tasks_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tasks_Users_PerformerId",
                        column: x => x.PerformerId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "WareTasks",
                columns: table => new
                {
                    TaskId = table.Column<int>(type: "int", nullable: false),
                    WareId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WareTasks", x => new { x.TaskId, x.WareId });
                    table.ForeignKey(
                        name: "FK_WareTasks_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WareTasks_Wares_WareId",
                        column: x => x.WareId,
                        principalTable: "Wares",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AuditorId",
                table: "Tasks",
                column: "AuditorId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AuthorId",
                table: "Tasks",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ParentTaskId",
                table: "Tasks",
                column: "ParentTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_PerformerId",
                table: "Tasks",
                column: "PerformerId");

            migrationBuilder.CreateIndex(
                name: "IX_WareTasks_WareId",
                table: "WareTasks",
                column: "WareId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Tasks_TaskId",
                table: "Comments",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
