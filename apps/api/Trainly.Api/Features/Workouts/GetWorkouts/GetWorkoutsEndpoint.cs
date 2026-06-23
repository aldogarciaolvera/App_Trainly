using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Workouts.GetWorkouts;

[ApiController]
[Route("api/workouts")]
public sealed class WorkoutEndpoint : ControllerBase
{
  private readonly GetWorkoutsHandler _handler;

  public WorkoutEndpoint(GetWorkoutsHandler handler)
  {
    _handler = handler;
  }

  [HttpGet]
  public async Task<ActionResult<GetWorkoutsResponse>> Get(
    [FromQuery] GetWorkoutsRequest request,
    CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);

    return Ok(response);
  }
}
