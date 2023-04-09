namespace WMS.Core.Models.Templates;

public class ProblemExpirationObjectsModel
{
    public ICollection<ProblemExpirationObject> ProblemExpirationObjects { get; }
    
    public ProblemExpirationObjectsModel(ICollection<ProblemExpirationObject> problemExpirationObjects)
    {
        this.ProblemExpirationObjects = problemExpirationObjects;
    }
}