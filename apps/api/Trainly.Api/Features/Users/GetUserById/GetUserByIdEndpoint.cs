using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Users.GetUserById;

[ApiController]
[Route("api/GetUserById")]
public sealed class Endpoint : ControllerBase
{
  private readonly Handler _handler;

  public Endpoint(Handler handler)
  {
    _handler = handler;
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<Response>> GetById(Guid id, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(id, cancellationToken);

    return Ok(response);
  }
}