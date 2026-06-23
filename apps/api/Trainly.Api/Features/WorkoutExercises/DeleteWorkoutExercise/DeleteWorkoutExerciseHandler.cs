using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.WorkoutExercises.DeleteWorkoutExercise;

public sealed class DeleteWorkoutExerciseHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public DeleteWorkoutExerciseHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task HandleAsync(Guid workoutId, Guid assignmentId, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();
    var item = await _db.WorkoutExercises
      .Include(x => x.Workout)
      .FirstOrDefaultAsync(
        x => x.Id == assignmentId && x.WorkoutId == workoutId && x.Workout.UserId == userId,
        cancellationToken);
    if (item is null)
    {
      throw new NotFoundException("Ejercicio del workout no encontrado.");
    }

    _db.WorkoutExercises.Remove(item);
    await _db.SaveChangesAsync(cancellationToken);
  }
}
