namespace WMS.Core.Services.Abstractions;

using WMS.Database.Entities;
using WMS.Database.Enums;

public interface IProblemService : IBaseService<Problem>
{
    Task UpdateStatusAsync(ProblemStatus status, int problemId);

    Task AssignAsync(int problemId, int? userId);
}
