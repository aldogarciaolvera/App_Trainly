using Scalar.AspNetCore;
using DotNetEnv;
using Trainly.Api.Configuration;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Database
builder.Services.AddDatabase(builder.Configuration);

// OpenAPI
builder.Services.AddOpenApi();

//Temporal 
builder.Services.AddScoped<Trainly.Api.Features.Users.CreateUser.Handler>();

var app = builder.Build();

// Development tools
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/", options =>
    {
        options.WithTitle("Trainly API");
        options.Layout = ScalarLayout.Modern;
        options.DarkMode = true;
        options.ShowSidebar = true;
        options.PersistentAuthentication = true;
        options.DocumentDownloadType = DocumentDownloadType.None;
        options.HideModels = true;
        options.HideSearch = true;
        options.HideClientButton = true;
        options.ShowDeveloperTools = DeveloperToolsVisibility.Never;
        options.DisableMcp();
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

