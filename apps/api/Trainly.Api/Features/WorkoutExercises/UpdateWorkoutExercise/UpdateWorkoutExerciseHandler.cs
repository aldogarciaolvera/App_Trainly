using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;
using Trainly.Api.Features.Exercises;

namespace Trainly.Api.Features.WorkoutExercises.UpdateWorkoutExercise;

public sealed class UpdateWorkoutExerciseHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public UpdateWorkoutExerciseHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<WorkoutExerciseResponse> HandleAsync(
    Guid workoutId, Guid assignmentId, WorkoutExerciseWriteRequest request, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();
    var item = await _db.WorkoutExercises
      .Include(x => x.Workout)
      .Include(x => x.Exercise)
      .FirstOrDefaultAsync(
        x => x.Id == assignmentId && x.WorkoutId == workoutId && x.Workout.UserId == userId,
        cancellationToken);
    if (item is null)
    {
      throw new NotFoundException("Ejercicio del workout no encontrado.");
    }

    var exercise = await _db.Exercises
      .VisibleTo(userId)
      .FirstOrDefaultAsync(x => x.Id == request.ExerciseId, cancellationToken);
    if (exercise is null)
    {
      throw new NotFoundException("Ejercicio no encontrado.");
    }

    var conflict = await _db.WorkoutExercises.AnyAsync(
      x => x.WorkoutId == workoutId && x.Id != assignmentId &&
        (x.ExerciseId == request.ExerciseId || x.Order == request.Order),
      cancellationToken);
    if (conflict)
    {
      throw new ConflictException("El ejercicio o la posición ya existe en el workout.");
    }

    item.ExerciseId = request.ExerciseId;
    item.Exercise = exercise;
    item.Order = request.Order;
    item.Sets = request.Sets;
    item.Reps = request.Reps;
    item.RestSeconds = request.RestSeconds;
    item.Notes = request.Notes;
    await _db.SaveChangesAsync(cancellationToken);

    return item.ToResponse();
  }
}
