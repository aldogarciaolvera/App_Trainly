namespace Trainly.Api.Common.Security;

public interface IRefreshTokenGenerator
{
  string GenerateRefreshToken();
}