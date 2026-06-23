using System.Security.Cryptography;

namespace Trainly.Api.Common.Security;

public sealed class RefreshTokenGenerator: IRefreshTokenGenerator
{
  public string GenerateRefreshToken()
  {
    return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
  }
}