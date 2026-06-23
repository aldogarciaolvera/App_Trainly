using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Features.Auth.Register;
using Trainly.Api.Features.Models;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Auth;

public sealed class RegisterTests
{
  [Fact]
  public async Task Register_creates_user_with_hashed_password()
  {
    await using var db = TestDbContextFactory.Create();
    var handler = new RegisterHandler(
      db,
      new StubPasswordHasher(),
      new StubTokenService());

    var response = await handler.HandleAsync(
      new RegisterRequest
      {
        Name = "Ana",
        Email = "ana@trainly.test",
        Password = "password123"
      },
      CancellationToken.None);

    var user = await db.Users.SingleAsync();
    Assert.Equal(user.Id, response.Id);
    Assert.Equal("hashed:password123", user.PasswordHash);
    Assert.Equal(UserRole.User, user.Role);
    Assert.Equal($"access-token:{user.Id}", response.Token);
  }

  [Fact]
  public async Task Register_rejects_duplicate_email()
  {
    await using var db = TestDbContextFactory.Create();
    db.Users.Add(UserWith("ana@trainly.test", "password123"));
    await db.SaveChangesAsync();
    var handler = new RegisterHandler(
      db,
      new StubPasswordHasher(),
      new StubTokenService());

    await Assert.ThrowsAsync<ConflictException>(() => handler.HandleAsync(
      new RegisterRequest
      {
        Name = "Another Ana",
        Email = "ana@trainly.test",
        Password = "password456"
      },
      CancellationToken.None));
  }

  private static User UserWith(string email, string password)
  {
    return new User
    {
      Name = "Ana",
      Email = email,
      PasswordHash = $"hashed:{password}"
    };
  }
}
