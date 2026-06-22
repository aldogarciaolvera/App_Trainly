using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Workouts.DeleteWorkout;

[ApiController]
[Route("api/workouts")]
public sealed class WorkoutEndpoint : ControllerBase
{
  private readonly DeleteWHandler _handler;

  public WorkoutEndpoint(DeleteWHandler handler)
  {
    _handler = handler;
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
  {
    await _handler.HandleAsync(id, cancellationToken);

    return NoContent();
  }
}
