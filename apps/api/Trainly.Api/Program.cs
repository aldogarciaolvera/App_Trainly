using DotNetEnv;
using Trainly.Api.Configuration.Database;
using Trainly.Api.Configuration.Validation;
using Trainly.Api.Configuration;
using Trainly.Api.Middleware;
using Trainly.Api.Configuration.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Controllers (global authorization)
builder.Services.AddControllers(options =>
{
	var policy = new AuthorizationPolicyBuilder()
		.RequireAuthenticatedUser()
		.Build();

	options.Filters.Add(new AuthorizeFilter(policy));
});

// Authorization
builder.Services.AddAuthorization();

//Validations
builder.Services.AddValidation();

// Database
builder.Services.AddDatabase(builder.Configuration);

//Servicios
builder.Services.AddApplicationServices();

// Autenticación JWT
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAdminBootstrap(builder.Configuration);

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// Development tools
app.UseOpenApiDocumentation();

app.UseGlobalExceptionHandling();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program;

