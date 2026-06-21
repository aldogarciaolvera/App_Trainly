using Trainly.Api.Features.Users.Models;

namespace Trainly.Api.Common.Security;

public interface ITokenService
{
  TokenResult GenerateToken(User user);
}
