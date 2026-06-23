using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;
using Trainly.Api.Features.Exercises;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.WorkoutExercises.AddWorkoutExercise;

public sealed class AddWorkoutExerciseHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public AddWorkoutExerciseHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<WorkoutExerciseResponse> HandleAsync(
    Guid workoutId, WorkoutExerciseWriteRequest request, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();
    var workoutExists = await _db.Workouts
      .AnyAsync(x => x.Id == workoutId && x.UserId == userId, cancellationToken);
    if (!workoutExists)
    {
      throw new NotFoundException("Workout no encontrado.");
    }

    var exercise = await _db.Exercises
      .VisibleTo(userId)
      .FirstOrDefaultAsync(x => x.Id == request.ExerciseId, cancellationToken);
    if (exercise is null)
    {
      throw new NotFoundException("Ejercicio no encontrado.");
    }

    var conflict = await _db.WorkoutExercises.AnyAsync(
      x => x.WorkoutId == workoutId &&
        (x.ExerciseId == request.ExerciseId || x.Order == request.Order),
      cancellationToken);
    if (conflict)
    {
      throw new ConflictException("El ejercicio o la posición ya existe en el workout.");
    }

    var item = new WorkoutExercise
    {
      WorkoutId = workoutId,
      ExerciseId = request.ExerciseId,
      Exercise = exercise,
      Order = request.Order,
      Sets = request.Sets,
      Reps = request.Reps,
      RestSeconds = request.RestSeconds,
      Notes = request.Notes
    };
    _db.WorkoutExercises.Add(item);
    await _db.SaveChangesAsync(cancellationToken);

    return item.ToResponse();
  }
}
