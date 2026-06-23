using Trainly.Api.Common.Exceptions;
using Trainly.Api.Features.Models;
using Trainly.Api.Features.WorkoutExercises;
using Trainly.Api.Features.WorkoutExercises.AddWorkoutExercise;
using Trainly.Api.Features.WorkoutExercises.GetWorkoutExercises;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Workouts;

public sealed class WorkoutExerciseTests
{
  [Fact]
  public async Task Add_accepts_global_exercise_for_owned_workout()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var workout = WorkoutFor(userId);
    var exercise = ExerciseFor(null, "Global");
    db.AddRange(workout, exercise);
    await db.SaveChangesAsync();
    var handler = new AddWorkoutExerciseHandler(db, new FixedUserContext(userId));

    var response = await handler.HandleAsync(
      workout.Id, RequestFor(exercise.Id, 1), CancellationToken.None);

    Assert.Equal(exercise.Id, response.ExerciseId);
    Assert.True(response.IsGlobal);
  }

  [Fact]
  public async Task Add_rejects_other_users_custom_exercise()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var workout = WorkoutFor(userId);
    var exercise = ExerciseFor(Guid.NewGuid(), "Private");
    db.AddRange(workout, exercise);
    await db.SaveChangesAsync();
    var handler = new AddWorkoutExerciseHandler(db, new FixedUserContext(userId));

    await Assert.ThrowsAsync<NotFoundException>(() => handler.HandleAsync(
      workout.Id, RequestFor(exercise.Id, 1), CancellationToken.None));
  }

  [Fact]
  public async Task Add_rejects_duplicate_exercise_or_order()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var workout = WorkoutFor(userId);
    var first = ExerciseFor(null, "First");
    var second = ExerciseFor(null, "Second");
    db.AddRange(workout, first, second);
    await db.SaveChangesAsync();
    var handler = new AddWorkoutExerciseHandler(db, new FixedUserContext(userId));
    await handler.HandleAsync(workout.Id, RequestFor(first.Id, 1), CancellationToken.None);

    await Assert.ThrowsAsync<ConflictException>(() => handler.HandleAsync(
      workout.Id, RequestFor(first.Id, 2), CancellationToken.None));
    await Assert.ThrowsAsync<ConflictException>(() => handler.HandleAsync(
      workout.Id, RequestFor(second.Id, 1), CancellationToken.None));
  }

  [Fact]
  public async Task List_orders_assignments_and_rejects_unowned_workout()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var workout = WorkoutFor(userId);
    var first = ExerciseFor(null, "First");
    var second = ExerciseFor(userId, "Second");
    db.AddRange(workout, first, second);
    await db.SaveChangesAsync();
    var add = new AddWorkoutExerciseHandler(db, new FixedUserContext(userId));
    await add.HandleAsync(workout.Id, RequestFor(second.Id, 2), CancellationToken.None);
    await add.HandleAsync(workout.Id, RequestFor(first.Id, 1), CancellationToken.None);
    var list = new GetWorkoutExercisesHandler(db, new FixedUserContext(userId));

    var response = await list.HandleAsync(workout.Id, CancellationToken.None);

    Assert.Equal([1, 2], response.Select(x => x.Order));
    await Assert.ThrowsAsync<NotFoundException>(() =>
      new GetWorkoutExercisesHandler(db, new FixedUserContext(Guid.NewGuid()))
        .HandleAsync(workout.Id, CancellationToken.None));
  }

  private static WorkoutExerciseWriteRequest RequestFor(Guid exerciseId, int order) => new()
  {
    ExerciseId = exerciseId,
    Order = order,
    Sets = 3,
    Reps = 10,
    RestSeconds = 60,
    Notes = string.Empty
  };

  private static Workout WorkoutFor(Guid userId) => new()
  {
    UserId = userId,
    Name = "Workout",
    Description = string.Empty
  };

  private static Exercise ExerciseFor(Guid? userId, string name) => new()
  {
    UserId = userId,
    Name = name,
    MuscleGroup = MuscleGroup.Other,
    Description = string.Empty,
    Instructions = string.Empty
  };
}
