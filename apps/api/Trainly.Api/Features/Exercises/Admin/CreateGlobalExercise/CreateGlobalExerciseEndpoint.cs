using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Exercises.Admin.CreateGlobalExercise;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/exercises")]
public sealed class AdminExercisesEndpoint : ControllerBase
{
  private readonly CreateGlobalExerciseHandler _handler;

  public AdminExercisesEndpoint(CreateGlobalExerciseHandler handler) => _handler = handler;

  [HttpPost]
  public async Task<ActionResult<ExerciseDetailsResponse>> Create(
    ExerciseWriteRequest request,
    CancellationToken cancellationToken)
  {
    var response = await _handler.HandleAsync(request, cancellationToken);
    return Created($"/api/exercises/{response.Id}", response);
  }
}
