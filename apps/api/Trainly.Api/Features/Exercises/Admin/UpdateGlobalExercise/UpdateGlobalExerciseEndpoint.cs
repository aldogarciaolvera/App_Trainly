using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Exercises.Admin.UpdateGlobalExercise;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/exercises")]
public sealed class AdminExercisesEndpoint : ControllerBase
{
  private readonly UpdateGlobalExerciseHandler _handler;

  public AdminExercisesEndpoint(UpdateGlobalExerciseHandler handler) => _handler = handler;

  [HttpPut("{id:guid}")]
  public async Task<ActionResult<ExerciseDetailsResponse>> Update(
    Guid id,
    ExerciseWriteRequest request,
    CancellationToken cancellationToken)
  {
    return Ok(await _handler.HandleAsync(id, request, cancellationToken));
  }
}
