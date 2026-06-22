using Microsoft.EntityFrameworkCore;
using Trainly.Api.Features.Auth.Logout;
using Trainly.Api.Features.Models;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Auth;

public sealed class LogoutTests
{
  [Fact]
  public async Task Logout_revokes_only_authenticated_users_active_tokens()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var otherUserId = Guid.NewGuid();
    var activeToken = TokenFor(userId, "active");
    var alreadyRevoked = TokenFor(userId, "revoked", isRevoked: true);
    var otherUsersToken = TokenFor(otherUserId, "other");
    db.RefreshTokens.AddRange(activeToken, alreadyRevoked, otherUsersToken);
    await db.SaveChangesAsync();
    var handler = new LogoutHandler(db, new FixedUserContext(userId));

    await handler.HandleAsync(CancellationToken.None);

    Assert.True(activeToken.IsRevoked);
    Assert.True(alreadyRevoked.IsRevoked);
    Assert.False(otherUsersToken.IsRevoked);
    Assert.Equal(3, await db.RefreshTokens.CountAsync());
  }

  private static RefreshToken TokenFor(Guid userId, string value, bool isRevoked = false)
  {
    return new RefreshToken
    {
      UserId = userId,
      Token = value,
      ExpiresAt = DateTime.UtcNow.AddDays(1),
      IsRevoked = isRevoked
    };
  }
}
