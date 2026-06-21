using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Workouts.DeleteWorkout;

[ApiController]
[Route("api/workouts/DeleteWorkout")]
public sealed class WorkoutEndpoint : ControllerBase
{
  private readonly DeleteWHandler _handler;

  public WorkoutEndpoint(DeleteWHandler handler)
  {
    _handler = handler;
  }

  [HttpDelete("{id:guid}")]
  public async Task<ActionResult<DeleteWResponse>> Delete(Guid id, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(id, cancellationToken);

    return Ok(response);
  }
}