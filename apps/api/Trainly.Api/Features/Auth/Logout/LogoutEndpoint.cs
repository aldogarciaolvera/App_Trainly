using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Auth.Logout;

[ApiController]
[Route("api/auth/Logout")]
public sealed class AuthEndpoint : ControllerBase
{
  private readonly LogoutHandler _handler;

  public AuthEndpoint(LogoutHandler handler)
  {
    _handler = handler;
  }

  [HttpPost]
  public async Task<ActionResult<LogoutResponse>> Logout(CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(cancellationToken);

    return Ok(response);
  }
}