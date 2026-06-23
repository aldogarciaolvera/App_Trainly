using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Exercises.Admin.UpdateGlobalExercise;

public sealed class UpdateGlobalExerciseHandler
{
  private readonly AppDbContext _db;

  public UpdateGlobalExerciseHandler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<ExerciseDetailsResponse> HandleAsync(
    Guid id, ExerciseWriteRequest request, CancellationToken cancellationToken)
  {
    var exercise = await _db.Exercises.FirstOrDefaultAsync(
      x => x.Id == id && x.UserId == null,
      cancellationToken);

    if (exercise is null)
    {
      throw new NotFoundException("Ejercicio global no encontrado.");
    }

    exercise.Name = request.Name;
    exercise.MuscleGroup = request.MuscleGroup!.Value;
    exercise.Description = request.Description;
    exercise.Instructions = request.Instructions;
    await _db.SaveChangesAsync(cancellationToken);

    return exercise.ToDetails();
  }
}
