# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS restore
WORKDIR /src

COPY Trainly.Api.csproj ./
RUN dotnet restore Trainly.Api.csproj

FROM restore AS publish
COPY . ./

RUN dotnet publish Trainly.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_HTTP_PORTS=8080 \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    DOTNET_EnableDiagnostics=0

EXPOSE 8080

COPY --from=publish /app/publish ./

USER $APP_UID

ENTRYPOINT ["dotnet", "Trainly.Api.dll"]
