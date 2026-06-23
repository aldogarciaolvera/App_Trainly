namespace Trainly.Api.Configuration.Authentication;

public sealed class AdminBootstrapHostedService : IHostedService
{
  private readonly IServiceScopeFactory _scopeFactory;

  public AdminBootstrapHostedService(IServiceScopeFactory scopeFactory)
  {
    _scopeFactory = scopeFactory;
  }

  public async Task StartAsync(CancellationToken cancellationToken)
  {
    await using var scope = _scopeFactory.CreateAsyncScope();
    var bootstrapper = scope.ServiceProvider.GetRequiredService<AdminBootstrapper>();
    await bootstrapper.PromoteFirstAdminAsync(cancellationToken);
  }

  public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
