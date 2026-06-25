namespace Trainly.Api.Configuration.Seed;

public static class ExerciseCatalogSeedExtensions
{
  public static IServiceCollection AddExerciseCatalogSeed(this IServiceCollection services)
  {
    services.AddScoped<ExerciseCatalogSeeder>();
    services.AddHostedService<ExerciseCatalogSeedHostedService>();

    return services;
  }
}
