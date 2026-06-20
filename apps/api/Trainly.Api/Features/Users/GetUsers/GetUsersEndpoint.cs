using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Users.GetUsers;

[ApiController]
[Route("api/users/GetUsers")]
public sealed class UsersEndpoint : ControllerBase
{
  private readonly Handler _handler;

  public UsersEndpoint(Handler handler)
  {
    _handler = handler;
  }

  [HttpGet]
  public async Task<ActionResult<Response>> Get([FromQuery] Request request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);

    return Ok(response);
  }
}