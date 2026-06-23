using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Auth.RefreshToken;

[ApiController]
[Route("api/auth")]
public sealed class AuthEndpoint : ControllerBase
{
  private readonly RTHandler _handler;

  public AuthEndpoint(RTHandler handler)
  {
    _handler = handler;
  }

  [HttpPost("refresh")]
  [Microsoft.AspNetCore.Authorization.AllowAnonymous]
  public async Task<ActionResult<RTResponse>> RefreshToken(RTRequest request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);

    return Ok(response);
  }
}
