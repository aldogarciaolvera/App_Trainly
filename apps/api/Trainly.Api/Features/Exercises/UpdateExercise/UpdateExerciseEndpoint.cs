using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Exercises.UpdateExercise;

[ApiController]
[Route("api/exercises")]
public sealed class ExercisesEndpoint : ControllerBase
{
  private readonly UpdateExerciseHandler _handler;

  public ExercisesEndpoint(UpdateExerciseHandler handler) => _handler = handler;

  [HttpPut("{id:guid}")]
  public async Task<ActionResult<ExerciseDetailsResponse>> Update(
    Guid id,
    ExerciseWriteRequest request,
    CancellationToken cancellationToken)
  {
    return Ok(await _handler.HandleAsync(id, request, cancellationToken));
  }
}
