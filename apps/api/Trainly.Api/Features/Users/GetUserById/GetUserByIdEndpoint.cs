using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Users.GetUserById;

[ApiController]
[Route("api/users/GetUserById")]
public sealed class UsersEndpoint : ControllerBase
{
  private readonly Handler _handler;

  public UsersEndpoint(Handler handler)
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