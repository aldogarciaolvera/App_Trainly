namespace Trainly.Api.Configuration;

public static class ServiceCollectionExtensions
{
  public static IServiceCollection AddApplicationServices(this IServiceCollection services)
  {
    services.AddScoped<Features.Users.CreateUser.Handler>();
    services.AddScoped<Features.Users.GetUserById.Handler>();

    return services;
  }
}