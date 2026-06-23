using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Users.GetUserById;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/users")]
public sealed class UsersEndpoint : ControllerBase
{
  private readonly GetUserByIdHandler _handler;

  public UsersEndpoint(GetUserByIdHandler handler)
  {
    _handler = handler;
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<GetUserByIDResponse>> GetById(Guid id, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(id, cancellationToken);

    return Ok(response);
  }
}
