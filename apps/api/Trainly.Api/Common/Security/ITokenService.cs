namespace Trainly.Api.Common.Security;

using Trainly.Api.Features.Users.Models;

public interface ITokenService
{
  string GenerateToken(User user);
}
