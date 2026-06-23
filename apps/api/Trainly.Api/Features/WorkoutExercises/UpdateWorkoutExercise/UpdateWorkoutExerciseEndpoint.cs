using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.WorkoutExercises.UpdateWorkoutExercise;

[ApiController]
[Route("api/workouts/{workoutId:guid}/exercises")]
public sealed class WorkoutExercisesEndpoint : ControllerBase
{
  private readonly UpdateWorkoutExerciseHandler _handler;

  public WorkoutExercisesEndpoint(UpdateWorkoutExerciseHandler handler) => _handler = handler;

  [HttpPut("{assignmentId:guid}")]
  public async Task<ActionResult<WorkoutExerciseResponse>> Update(
    Guid workoutId, Guid assignmentId, WorkoutExerciseWriteRequest request, CancellationToken cancellationToken)
  {
    return Ok(await _handler.HandleAsync(
      workoutId, assignmentId, request, cancellationToken));
  }
}
