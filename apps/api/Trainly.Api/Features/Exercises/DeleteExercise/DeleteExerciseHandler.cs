using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Exercises.DeleteExercise;

public sealed class DeleteExerciseHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public DeleteExerciseHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task HandleAsync(Guid id, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();
    var exercise = await _db.Exercises.FirstOrDefaultAsync(
      x => x.Id == id && x.UserId == userId,
      cancellationToken);

    if (exercise is null)
    {
      throw new NotFoundException("Ejercicio personalizado no encontrado.");
    }

    _db.Exercises.Remove(exercise);
    await _db.SaveChangesAsync(cancellationToken);
  }
}
