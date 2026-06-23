using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Workouts.GetWorkoutById;

[ApiController]
[Route("api/workouts")]
public sealed class WorkoutEndpoint : ControllerBase
{
  private readonly GetWorkoutByIdHandler _handler;

  public WorkoutEndpoint(GetWorkoutByIdHandler handler)
  {
    _handler = handler;
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<GetWorkoutByIdResponse>> GetById(Guid id, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(id, cancellationToken);

    return Ok(response);
  }
}
