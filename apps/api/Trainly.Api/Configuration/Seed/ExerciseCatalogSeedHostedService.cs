namespace Trainly.Api.Configuration.Seed;

public sealed class ExerciseCatalogSeedHostedService : IHostedService
{
  private readonly IServiceScopeFactory _scopeFactory;

  public ExerciseCatalogSeedHostedService(IServiceScopeFactory scopeFactory)
  {
    _scopeFactory = scopeFactory;
  }

  public async Task StartAsync(CancellationToken cancellationToken)
  {
    using var scope = _scopeFactory.CreateScope();
    var seeder = scope.ServiceProvider.GetRequiredService<ExerciseCatalogSeeder>();

    await seeder.SeedAsync(cancellationToken);
  }

  public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
