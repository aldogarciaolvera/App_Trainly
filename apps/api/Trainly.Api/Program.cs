using DotNetEnv;
using Trainly.Api.Configuration.Database;
using Trainly.Api.Configuration.Validation;
using Trainly.Api.Configuration;
using Trainly.Api.Middleware;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

//Validations
builder.Services.AddValidation();

// Database
builder.Services.AddDatabase(builder.Configuration);

//Servicios
builder.Services.AddApplicationServices();

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// Development tools
app.UseOpenApiDocumentation();

app.UseGlobalExceptionHandling();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

