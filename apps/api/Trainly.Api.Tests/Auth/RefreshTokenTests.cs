using Microsoft.EntityFrameworkCore;
using Trainly.Api.Features.Auth.RefreshToken;
using Trainly.Api.Features.Models;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Auth;

public sealed class RefreshTokenTests
{
  [Fact]
  public async Task Refresh_rotates_valid_refresh_token()
  {
    await using var db = TestDbContextFactory.Create();
    var user = UserWith("ana@trainly.test");
    db.Users.Add(user);
    await db.SaveChangesAsync();
    var oldToken = new RefreshToken
    {
      UserId = user.Id,
      Token = "old-refresh-token",
      ExpiresAt = DateTime.UtcNow.AddDays(1)
    };
    db.RefreshTokens.Add(oldToken);
    await db.SaveChangesAsync();
    var handler = new RTHandler(
      db,
      new StubTokenService(),
      new StubRefreshTokenGenerator("new-refresh-token"));

    var response = await handler.HandleAsync(
      new RTRequest { RefreshToken = "old-refresh-token" },
      CancellationToken.None);

    var tokens = await db.RefreshTokens.OrderBy(x => x.CreatedAt).ToListAsync();
    Assert.True(oldToken.IsRevoked);
    Assert.Equal("new-refresh-token", response.RefreshToken);
    Assert.Equal(2, tokens.Count);
    Assert.Contains(tokens, x => x.Token == "new-refresh-token" && !x.IsRevoked);
  }

  [Fact]
  public async Task Refresh_rejects_unknown_token()
  {
    await using var db = TestDbContextFactory.Create();
    var handler = new RTHandler(
      db,
      new StubTokenService(),
      new StubRefreshTokenGenerator("new-refresh-token"));

    await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.HandleAsync(
      new RTRequest { RefreshToken = "unknown" },
      CancellationToken.None));
  }

  private static User UserWith(string email)
  {
    return new User
    {
      Name = "Ana",
      Email = email,
      PasswordHash = "not-used-in-this-test"
    };
  }
}
