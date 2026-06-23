using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Exercises.Admin.DeleteGlobalExercise;

public sealed class DeleteGlobalExerciseHandler
{
  private readonly AppDbContext _db;

  public DeleteGlobalExerciseHandler(AppDbContext db)
  {
    _db = db;
  }

  public async Task HandleAsync(Guid id, CancellationToken cancellationToken)
  {
    var exercise = await _db.Exercises.FirstOrDefaultAsync(
      x => x.Id == id && x.UserId == null,
      cancellationToken);

    if (exercise is null)
    {
      throw new NotFoundException("Ejercicio global no encontrado.");
    }

    _db.Exercises.Remove(exercise);
    await _db.SaveChangesAsync(cancellationToken);
  }
}
