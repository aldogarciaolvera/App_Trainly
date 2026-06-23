using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.WorkoutExercises.GetWorkoutExercises;

public sealed class GetWorkoutExercisesHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public GetWorkoutExercisesHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<List<WorkoutExerciseResponse>> HandleAsync(Guid workoutId, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();
    var workoutExists = await _db.Workouts
      .AnyAsync(x => x.Id == workoutId && x.UserId == userId, cancellationToken);
    if (!workoutExists)
    {
      throw new NotFoundException("Workout no encontrado.");
    }

    return await _db.WorkoutExercises
      .AsNoTracking()
      .Where(x => x.WorkoutId == workoutId)
      .OrderBy(x => x.Order)
      .Select(x => new WorkoutExerciseResponse
      {
        Id = x.Id,
        ExerciseId = x.ExerciseId,
        ExerciseName = x.Exercise.Name,
        MuscleGroup = x.Exercise.MuscleGroup.ToString(),
        IsGlobal = x.Exercise.UserId == null,
        Order = x.Order,
        Sets = x.Sets,
        Reps = x.Reps,
        RestSeconds = x.RestSeconds,
        Notes = x.Notes
      })
      .ToListAsync(cancellationToken);
  }
}
