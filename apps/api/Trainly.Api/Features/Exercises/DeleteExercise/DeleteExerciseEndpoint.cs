using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Exercises.DeleteExercise;

[ApiController]
[Route("api/exercises")]
public sealed class ExercisesEndpoint : ControllerBase
{
  private readonly DeleteExerciseHandler _handler;

  public ExercisesEndpoint(DeleteExerciseHandler handler) => _handler = handler;

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
  {
    await _handler.HandleAsync(id, cancellationToken);
    return NoContent();
  }
}
