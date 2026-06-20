using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Users.CreateUser;

[ApiController]
[Route("api/CreateUser")]
public sealed class Endpoint : ControllerBase
{
  private readonly Handler _handler;

  public Endpoint(Handler handler)
  {
    _handler = handler;
  }

  [HttpPost]
  public async Task<ActionResult<Response>> Create(Request request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);

    return Ok(response);
  }
}