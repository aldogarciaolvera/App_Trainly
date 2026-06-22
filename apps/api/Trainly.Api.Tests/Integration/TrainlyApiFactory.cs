using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Trainly.Api.Database;

namespace Trainly.Api.Tests.Integration;

public sealed class TrainlyApiFactory : WebApplicationFactory<Program>
{
  private readonly string _databaseName = $"trainly-tests-{Guid.NewGuid()}";
  private readonly IServiceProvider _databaseServices = new ServiceCollection()
    .AddEntityFrameworkInMemoryDatabase()
    .BuildServiceProvider();

  protected override void ConfigureWebHost(IWebHostBuilder builder)
  {
    builder.UseEnvironment("Testing");
    builder.UseSetting(
      "Jwt:Key",
      "trainly-integration-tests-signing-key-at-least-32-bytes");
    builder.UseSetting("Jwt:Issuer", "TrainlyTests");
    builder.UseSetting("Jwt:Audience", "TrainlyTests");
    builder.ConfigureLogging(logging => logging.ClearProviders());

    builder.ConfigureServices(services =>
    {
      services.RemoveAll<AppDbContext>();
      services.RemoveAll<DbContextOptions<AppDbContext>>();
      services.AddDbContext<AppDbContext>(options =>
        options
          .UseInMemoryDatabase(_databaseName)
          .UseInternalServiceProvider(_databaseServices));

      services
        .AddAuthentication(options =>
        {
          options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
          options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
          options.DefaultForbidScheme = TestAuthHandler.SchemeName;
        })
        .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
          TestAuthHandler.SchemeName,
          _ => { });
    });
  }

  public HttpClient CreateAnonymousClient() => CreateTestClient();

  public HttpClient CreateAuthenticatedClient(Guid userId, string? role = null)
  {
    var client = CreateTestClient();
    client.DefaultRequestHeaders.Add(TestAuthHandler.UserIdHeader, userId.ToString());

    if (role is not null)
    {
      client.DefaultRequestHeaders.Add(TestAuthHandler.RoleHeader, role);
    }

    return client;
  }

  public async Task ResetDatabaseAsync()
  {
    using var scope = Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureDeletedAsync();
    await db.Database.EnsureCreatedAsync();
  }

  public async Task SeedAsync(params object[] entities)
  {
    using var scope = Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.AddRange(entities);
    await db.SaveChangesAsync();
  }

  private HttpClient CreateTestClient()
  {
    return CreateClient(new WebApplicationFactoryClientOptions
    {
      BaseAddress = new Uri("https://localhost"),
      AllowAutoRedirect = false
    });
  }
}
