using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Trainly.Api.Configuration.Authentication;
using Trainly.Api.Database;
using Trainly.Api.Features.Models;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Auth;

public sealed class AdminBootstrapperTests
{
  [Fact]
  public async Task Bootstrap_promotes_configured_user_when_no_admin_exists()
  {
    await using var db = TestDbContextFactory.Create();
    var user = UserWith("first-admin@trainly.test");
    db.Users.Add(user);
    await db.SaveChangesAsync();
    var bootstrapper = CreateBootstrapper(db, "FIRST-ADMIN@trainly.test");

    await bootstrapper.PromoteFirstAdminAsync(CancellationToken.None);

    Assert.Equal(UserRole.Admin, user.Role);
  }

  [Fact]
  public async Task Bootstrap_does_not_promote_another_user_when_admin_exists()
  {
    await using var db = TestDbContextFactory.Create();
    var existingAdmin = UserWith("admin@trainly.test", UserRole.Admin);
    var candidate = UserWith("candidate@trainly.test");
    db.Users.AddRange(existingAdmin, candidate);
    await db.SaveChangesAsync();
    var bootstrapper = CreateBootstrapper(db, candidate.Email);

    await bootstrapper.PromoteFirstAdminAsync(CancellationToken.None);

    Assert.Equal(UserRole.Admin, existingAdmin.Role);
    Assert.Equal(UserRole.User, candidate.Role);
  }

  private static AdminBootstrapper CreateBootstrapper(
    AppDbContext db,
    string email)
  {
    return new AdminBootstrapper(
      db,
      Options.Create(new AdminBootstrapOptions { Email = email }),
      NullLogger<AdminBootstrapper>.Instance);
  }

  private static User UserWith(string email, UserRole role = UserRole.User)
  {
    return new User
    {
      Name = "Test user",
      Email = email,
      PasswordHash = "not-used-in-this-test",
      Role = role
    };
  }
}
