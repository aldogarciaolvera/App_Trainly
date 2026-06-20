using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Auth.Register;

[ApiController]
[Route("api/auth/Register")]
public sealed class AuthEndpoint : ControllerBase
{
  private readonly Handler _handler;

  public AuthEndpoint(Handler handler)
  {
    _handler = handler;
  }

  [HttpPost]
  [Microsoft.AspNetCore.Authorization.AllowAnonymous]
  public async Task<ActionResult<Response>> Create(Request request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);

    return Ok(response);
  }
}