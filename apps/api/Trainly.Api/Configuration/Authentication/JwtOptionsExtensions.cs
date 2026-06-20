namespace Trainly.Api.Configuration.Authentication;

public static class JwtOptionsExtensions
{
  public static IServiceCollection AddJwtOptions(this IServiceCollection services, IConfiguration configuration)
  {
    services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

    return services;
  }
}