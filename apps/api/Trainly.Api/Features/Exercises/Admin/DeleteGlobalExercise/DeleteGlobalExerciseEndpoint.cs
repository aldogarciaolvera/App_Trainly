using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Exercises.Admin.DeleteGlobalExercise;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/exercises")]
public sealed class AdminExercisesEndpoint : ControllerBase
{
  private readonly DeleteGlobalExerciseHandler _handler;

  public AdminExercisesEndpoint(DeleteGlobalExerciseHandler handler) => _handler = handler;

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
  {
    await _handler.HandleAsync(id, cancellationToken);
    return NoContent();
  }
}
