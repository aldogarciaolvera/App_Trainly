using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Exercises.GetExercises;

[ApiController]
[Route("api/exercises")]
public sealed class ExercisesEndpoint : ControllerBase
{
  private readonly GetExercisesHandler _handler;

  public ExercisesEndpoint(GetExercisesHandler handler) => _handler = handler;

  [HttpGet]
  public async Task<ActionResult<GetExercisesResponse>> Get(
    [FromQuery] GetExercisesRequest request,
    CancellationToken cancellationToken)
  {
    return Ok(await _handler.HandleAsync(request, cancellationToken));
  }
}
