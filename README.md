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
### Generate script with migrations
```
dotnet ef migrations script --project WMS.Database.Migrations --startup-project WMS.WebApi --output ./migrations.sql -- --mode=design-time
```