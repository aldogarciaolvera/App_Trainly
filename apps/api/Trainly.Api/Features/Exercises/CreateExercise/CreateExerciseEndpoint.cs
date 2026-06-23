using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Exercises.CreateExercise;

[ApiController]
[Route("api/exercises")]
public sealed class ExercisesEndpoint : ControllerBase
{
  private readonly CreateExerciseHandler _handler;

  public ExercisesEndpoint(CreateExerciseHandler handler) => _handler = handler;

  [HttpPost]
  public async Task<ActionResult<ExerciseDetailsResponse>> Create(
    ExerciseWriteRequest request,
    CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);
    return Created($"/api/exercises/{response.Id}", response);
  }
}
