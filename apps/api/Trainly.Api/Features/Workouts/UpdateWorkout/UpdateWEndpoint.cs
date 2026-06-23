using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Workouts.UpdateWorkout;

[ApiController]
[Route("api/workouts")]
public sealed class WorkoutEndpoint : ControllerBase
{
  private readonly UpdateWHandler _handler;

  public WorkoutEndpoint(UpdateWHandler handler)
  {
    _handler = handler;
  }

  [HttpPut("{id:guid}")]
  public async Task<ActionResult<UpdateWResponse>> Update(Guid id, UpdateWRequest request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(id, request, cancellationToken);

    return Ok(response);
  }
}
