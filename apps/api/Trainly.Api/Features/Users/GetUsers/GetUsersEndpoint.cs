using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Users.GetUsers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/users")]
public sealed class UsersEndpoint : ControllerBase
{
  private readonly GetUsersHandler _handler;

  public UsersEndpoint(GetUsersHandler handler)
  {
    _handler = handler;
  }

  [HttpGet]
  public async Task<ActionResult<GetUsersResponse>> Get([FromQuery] GetUsersRequest request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);

    return Ok(response);
  }
}
