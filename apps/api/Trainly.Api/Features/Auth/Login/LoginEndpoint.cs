using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Auth.Login;

[ApiController]
[Route("api/auth")]
public sealed class AuthEndpoint : ControllerBase
{
  private readonly LoginHandler _handler;

  public AuthEndpoint(LoginHandler handler)
  {
    _handler = handler;
  }

  [HttpPost("login")]
  [Microsoft.AspNetCore.Authorization.AllowAnonymous]
  public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);

    return Ok(response);
  }
}

