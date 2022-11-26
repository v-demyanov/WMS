namespace WMS.Core.Services.Abstractions;

using WMS.Database.Entities;

public interface IWareService
{
    Ware Create(Ware wareCreateDate);

    void Update(Ware wareUpdateData);
}
