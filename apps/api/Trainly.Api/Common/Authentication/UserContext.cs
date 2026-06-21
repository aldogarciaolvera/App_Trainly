using System.Security.Claims;

namespace Trainly.Api.Common.Authentication;

public sealed class UserContext : IUserContext
{
  private readonly IHttpContextAccessor _httpContextAccessor;

  public UserContext(
      IHttpContextAccessor httpContextAccessor)
  {
    _httpContextAccessor = httpContextAccessor;
  }

  public Guid GetUserId()
  {
    var userId =
      _httpContextAccessor
        .HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (string.IsNullOrWhiteSpace(userId))
    {
      throw new UnauthorizedAccessException("Usuario no autenticado.");
    }

    return Guid.Parse(userId);
  }
}