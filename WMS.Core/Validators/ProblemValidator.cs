namespace WMS.Core.Validators;

using FluentValidation;

using WMS.Database;
using WMS.Database.Entities;

public class ProblemValidator : AbstractValidator<Problem>
{
    private readonly WmsDbContext _dbContext;

    public ProblemValidator(WmsDbContext dbContext)
    {
        this._dbContext = dbContext;
        
        this.RuleFor(problem => problem.PerformerId)
            .Must(performerId => performerId is null || dbContext.Users.Any(x => x.Id == performerId))
            .WithMessage("The performer with such id has not been found.");
        
        this.RuleFor(problem => problem.ParentProblemId)
            .Must(parentProblemId => parentProblemId is null || dbContext.Problems.Any(x => x.Id == parentProblemId))
            .WithMessage("The parent problem with such id has not been found.");
        
        this.RuleFor(problem => problem.AuthorId)
            .Must(authorId => dbContext.Users.Any(x => x.Id == authorId))
            .WithMessage("The author with such id has not been found.");
        
        this.RuleFor(problem => problem.AuditorId)
            .Must(auditorId => auditorId is null || dbContext.Users.Any(x => x.Id == auditorId))
            .WithMessage("The auditor with such id has not been found.");

        this.RuleFor(problem => problem.WareId)
            .Must(wareId => wareId is null || dbContext.Wares.Any(x => x.Id == wareId))
            .WithMessage("The ware with such id has not been found.");
    }
}