namespace WMS.Core.Helpers;

using WMS.Database.Entities;

public static class ProblemHelper
{
    public static void Populate(Problem destination, Problem source)
    {
        destination.Title = source.Title;
        destination.Description = source.Description;
        destination.Status = source.Status;
        destination.CreatedDate = source.CreatedDate;
        destination.LastUpdateDate = source.LastUpdateDate;
        destination.DeadlineDate = source.DeadlineDate;
        destination.PerformerId = source.PerformerId;
        destination.ParentProblemId = source.ParentProblemId;
        destination.AuthorId = source.AuthorId;
        destination.WareId = source.WareId;
        destination.TargetShelfId = source.TargetShelfId;
    }
}