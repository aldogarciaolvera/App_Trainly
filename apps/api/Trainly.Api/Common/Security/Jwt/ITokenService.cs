using Trainly.Api.Features.Models;

namespace Trainly.Api.Common.Security;

public interface ITokenService
{
  TokenResult GenerateToken(User user);
}
