using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Auth.Register;

[ApiController]
[Route("api/auth")]
public sealed class AuthEndpoint : ControllerBase
{
  private readonly RegisterHandler _handler;

  public AuthEndpoint(RegisterHandler handler)
  {
    _handler = handler;
  }

  [HttpPost("register")]
  [Microsoft.AspNetCore.Authorization.AllowAnonymous]
  public async Task<ActionResult<RegisterResponse>> Create(RegisterRequest request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);

    return Created($"/api/users/{response.Id}", response);
  }
}
