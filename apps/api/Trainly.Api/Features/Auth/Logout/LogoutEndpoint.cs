using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Auth.Logout;

[ApiController]
[Route("api/auth")]
public sealed class AuthEndpoint : ControllerBase
{
  private readonly LogoutHandler _handler;

  public AuthEndpoint(LogoutHandler handler)
  {
    _handler = handler;
  }

  [HttpPost("logout")]
  public async Task<IActionResult> Logout(CancellationToken cancellationToken)
  {
    await _handler.HandleAsync(cancellationToken);

    return NoContent();
  }
}
