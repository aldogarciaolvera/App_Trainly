using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Workouts.GetWorkouts;

[ApiController]
[Route("api/workouts/GetWorkouts")]
public sealed class WorkoutEndpoint : ControllerBase
{
  private readonly GetWorkoutsHandler _handler;

  public WorkoutEndpoint(GetWorkoutsHandler handler)
  {
    _handler = handler;
  }

  [HttpGet]
  public async Task<ActionResult<GetWorkoutsResponse>> Get(CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(cancellationToken);

    return Ok(response);
  }
}