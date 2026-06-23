using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Exercises.GetExerciseById;

[ApiController]
[Route("api/exercises")]
public sealed class ExercisesEndpoint : ControllerBase
{
  private readonly GetExerciseByIdHandler _handler;

  public ExercisesEndpoint(GetExerciseByIdHandler handler) => _handler = handler;

  [HttpGet("{id:guid}")]
  public async Task<ActionResult<ExerciseDetailsResponse>> GetById(
    Guid id,
    CancellationToken cancellationToken)
  {
    return Ok(await _handler.HandleAsync(id, cancellationToken));
  }
}
