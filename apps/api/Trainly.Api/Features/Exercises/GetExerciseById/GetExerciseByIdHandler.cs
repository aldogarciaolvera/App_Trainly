using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Exercises.GetExerciseById;

public sealed class GetExerciseByIdHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public GetExerciseByIdHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<ExerciseDetailsResponse> HandleAsync(Guid id, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();
    var exercise = await _db.Exercises
      .AsNoTracking()
      .VisibleTo(userId)
      .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    if (exercise is null)
    {
      throw new NotFoundException("Ejercicio no encontrado.");
    }

    return exercise.ToDetails();
  }
}
