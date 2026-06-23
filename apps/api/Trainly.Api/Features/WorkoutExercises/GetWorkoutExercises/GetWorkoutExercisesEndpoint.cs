using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.WorkoutExercises.GetWorkoutExercises;

[ApiController]
[Route("api/workouts/{workoutId:guid}/exercises")]
public sealed class WorkoutExercisesEndpoint : ControllerBase
{
  private readonly GetWorkoutExercisesHandler _handler;

  public WorkoutExercisesEndpoint(GetWorkoutExercisesHandler handler) => _handler = handler;

  [HttpGet]
  public async Task<ActionResult<List<WorkoutExerciseResponse>>> Get(Guid workoutId, CancellationToken cancellationToken)
  {
    return Ok(await _handler.HandleAsync(workoutId, cancellationToken));
  }
}
