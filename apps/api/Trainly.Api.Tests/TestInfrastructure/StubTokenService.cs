using Trainly.Api.Common.Security;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Tests.TestInfrastructure;

internal sealed class StubTokenService : ITokenService
{
  public static readonly DateTime Expiration = new(2100, 1, 1, 0, 0, 0, DateTimeKind.Utc);

  public TokenResult GenerateToken(User user)
  {
    return new TokenResult
    {
      AccessToken = $"access-token:{user.Id}",
      ExpiresAt = Expiration
    };
  }
}
