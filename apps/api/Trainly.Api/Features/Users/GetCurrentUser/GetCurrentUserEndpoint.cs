using Microsoft.AspNetCore.Mvc;
using Trainly.Api.Features.Users.GetUserById;

namespace Trainly.Api.Features.Users.GetCurrentUser;

[ApiController]
[Route("api/users")]
public sealed class UsersEndpoint : ControllerBase
{
  private readonly GetCurrentUserHandler _handler;

  public UsersEndpoint(GetCurrentUserHandler handler)
  {
    _handler = handler;
  }

  [HttpGet("me")]
  public async Task<ActionResult<GetUserByIDResponse>> GetCurrent(
    CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(cancellationToken);

    return Ok(response);
  }
}
