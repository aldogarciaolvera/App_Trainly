using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.WorkoutExercises.DeleteWorkoutExercise;

[ApiController]
[Route("api/workouts/{workoutId:guid}/exercises")]
public sealed class WorkoutExercisesEndpoint : ControllerBase
{
  private readonly DeleteWorkoutExerciseHandler _handler;

  public WorkoutExercisesEndpoint(DeleteWorkoutExerciseHandler handler) => _handler = handler;

  [HttpDelete("{assignmentId:guid}")]
  public async Task<IActionResult> Delete(Guid workoutId, Guid assignmentId, CancellationToken cancellationToken)
  {
    await _handler.HandleAsync(workoutId, assignmentId, cancellationToken);
    return NoContent();
  }
}
