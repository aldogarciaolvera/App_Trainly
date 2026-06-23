using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.WorkoutExercises.AddWorkoutExercise;

[ApiController]
[Route("api/workouts/{workoutId:guid}/exercises")]
public sealed class WorkoutExercisesEndpoint : ControllerBase
{
  private readonly AddWorkoutExerciseHandler _handler;

  public WorkoutExercisesEndpoint(AddWorkoutExerciseHandler handler) => _handler = handler;

  [HttpPost]
  public async Task<ActionResult<WorkoutExerciseResponse>> Add(
    Guid workoutId, WorkoutExerciseWriteRequest request, CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(workoutId, request, cancellationToken);
    return Created($"/api/workouts/{workoutId}/exercises/{response.Id}", response);
  }
}
