# WMS

### Migrations
### Add migration
```
dotnet ef migrations add MigrationName --project WMS.Database.Migrations --startup-project WMS.WebApi
```
### Apply migrations
```
dotnet ef database update --project WMS.Database.Migrations --startup-project WMS.WebApi -- --mode=design-time
```
