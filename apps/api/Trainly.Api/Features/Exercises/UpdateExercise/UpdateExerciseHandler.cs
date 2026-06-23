using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Exercises.UpdateExercise;

public sealed class UpdateExerciseHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public UpdateExerciseHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<ExerciseDetailsResponse> HandleAsync(
    Guid id, ExerciseWriteRequest request, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();
    var exercise = await _db.Exercises.FirstOrDefaultAsync(
      x => x.Id == id && x.UserId == userId,
      cancellationToken);

    if (exercise is null)
    {
      throw new NotFoundException("Ejercicio personalizado no encontrado.");
    }

    exercise.Name = request.Name;
    exercise.MuscleGroup = request.MuscleGroup!.Value;
    exercise.Description = request.Description;
    exercise.Instructions = request.Instructions;
    await _db.SaveChangesAsync(cancellationToken);

    return exercise.ToDetails();
  }
}
