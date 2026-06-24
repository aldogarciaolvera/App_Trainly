# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS restore
WORKDIR /src

COPY Trainly.Api.csproj ./
RUN dotnet restore Trainly.Api.csproj
RUN dotnet tool install --global dotnet-ef --version 10.0.9

ENV PATH="$PATH:/root/.dotnet/tools"

FROM restore AS publish
COPY . ./
RUN dotnet publish Trainly.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish \
    /p:UseAppHost=false

RUN dotnet ef migrations bundle \
    --project Trainly.Api.csproj \
    --configuration Release \
    --no-build \
    --output /app/publish/efbundle

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_HTTP_PORTS=8080 \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    RUN_MIGRATIONS=true \
    DOTNET_EnableDiagnostics=0

EXPOSE 8080

COPY --from=publish /app/publish ./

USER $APP_UID

ENTRYPOINT ["sh", "-c", "if [ \"${RUN_MIGRATIONS:-true}\" = \"true\" ]; then ./efbundle --connection \"Host=${Database__Host};Port=${Database__Port};Database=${Database__Database};Username=${Database__Username};Password=${Database__Password}\"; fi; exec dotnet Trainly.Api.dll"]
