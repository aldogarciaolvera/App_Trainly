using Trainly.Api.Common.Security;

namespace Trainly.Api.Tests.TestInfrastructure;

internal sealed class StubRefreshTokenGenerator : IRefreshTokenGenerator
{
  private readonly string _token;

  public StubRefreshTokenGenerator(string token)
  {
    _token = token;
  }

  public string GenerateRefreshToken() => _token;
}
