using Trainly.Api.Common.Security;

namespace Trainly.Api.Configuration;

public static class ServiceCollectionExtensions
{
  public static IServiceCollection AddApplicationServices(this IServiceCollection services)
  {
    services.AddScoped<IPasswordHasher, PasswordHasher>();
    services.AddScoped<ITokenService, JwtTokenService>();
    services.AddScoped<Features.Auth.Register.RegisterHandler>();
    services.AddScoped<Features.Auth.Login.LoginHandler>();
    services.AddScoped<Features.Users.GetUserById.GetUserByIdHandler>();
    services.AddScoped<Features.Users.GetUsers.GetUsersHandler>();

    return services;
  }
}