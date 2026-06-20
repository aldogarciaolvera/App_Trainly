using Trainly.Api.Common.Security;

namespace Trainly.Api.Configuration;

public static class ServiceCollectionExtensions
{
  public static IServiceCollection AddApplicationServices(this IServiceCollection services)
  {
    services.AddScoped<IPasswordHasher, PasswordHasher>();
    services.AddScoped<ITokenService, JwtTokenService>();
    services.AddScoped<Features.Auth.Register.Handler>();
    services.AddScoped<Features.Users.GetUserById.Handler>();
    services.AddScoped<Features.Users.GetUsers.Handler>();

    return services;
  }
}