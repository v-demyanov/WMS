#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["WMS.WebApi/WMS.WebApi.csproj", "WMS.WebApi/"]
COPY ["WMS.Database/WMS.Database.csproj", "WMS.Database/"]
COPY ["WMS.Core/WMS.Core.csproj", "WMS.Core/"]
COPY ["WMS.Database.Migrations/WMS.Database.Migrations.csproj", "WMS.Database.Migrations/"]
RUN dotnet restore "WMS.WebApi/WMS.WebApi.csproj"
COPY . .
WORKDIR "/src/WMS.WebApi"
RUN dotnet build "WMS.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WMS.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ADD ["WMS.WebApi/Templates", "./Templates/"]
ENTRYPOINT ["dotnet", "WMS.WebApi.dll"]
