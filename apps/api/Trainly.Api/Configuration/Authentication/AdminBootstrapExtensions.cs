namespace Trainly.Api.Configuration.Authentication;

public static class AdminBootstrapExtensions
{
  public static IServiceCollection AddAdminBootstrap(this IServiceCollection services, IConfiguration configuration)
  {
    services.Configure<AdminBootstrapOptions>(configuration.GetSection("AdminBootstrap"));
    services.AddScoped<AdminBootstrapper>();
    services.AddHostedService<AdminBootstrapHostedService>();

    return services;
  }
}
