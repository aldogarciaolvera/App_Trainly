using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Features.Models;
using Trainly.Api.Features.Workouts.CreateWorkout;
using Trainly.Api.Features.Workouts.DeleteWorkout;
using Trainly.Api.Features.Workouts.GetWorkoutById;
using Trainly.Api.Features.Workouts.GetWorkouts;
using Trainly.Api.Features.Workouts.UpdateWorkout;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Workouts;

public sealed class WorkoutCrudTests
{
  [Fact]
  public async Task Create_assigns_workout_to_authenticated_user()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var handler = new CreateWHandler(db, new FixedUserContext(userId));

    var response = await handler.HandleAsync(
      new CreateWRequest
      {
        Name = "Torso",
        Description = "Pecho y espalda"
      },
      CancellationToken.None);

    var stored = await db.Workouts.SingleAsync();

    Assert.Equal(userId, response.UserId);
    Assert.Equal(userId, stored.UserId);
    Assert.Equal("Torso", stored.Name);
  }

  [Fact]
  public async Task Get_all_returns_only_requested_page_for_authenticated_user()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var otherUserId = Guid.NewGuid();
    db.Workouts.AddRange(
      WorkoutFor(userId, "Gamma"),
      WorkoutFor(userId, "Alpha"),
      WorkoutFor(userId, "Beta"),
      WorkoutFor(otherUserId, "Private"));
    await db.SaveChangesAsync();
    var handler = new GetWorkoutsHandler(db, new FixedUserContext(userId));

    var response = await handler.HandleAsync(
      new GetWorkoutsRequest { Page = 2, PageSize = 1 },
      CancellationToken.None);

    var item = Assert.Single(response.Items);
    Assert.Equal("Beta", item.Name);
    Assert.Equal(3, response.Total);
    Assert.Equal(2, response.Page);
    Assert.Equal(1, response.PageSize);
  }

  [Fact]
  public async Task Get_by_id_does_not_expose_another_users_workout()
  {
    await using var db = TestDbContextFactory.Create();
    var workout = WorkoutFor(Guid.NewGuid(), "Private");
    db.Workouts.Add(workout);
    await db.SaveChangesAsync();
    var handler = new GetWorkoutByIdHandler(
      db,
      new FixedUserContext(Guid.NewGuid()));

    await Assert.ThrowsAsync<NotFoundException>(() =>
      handler.HandleAsync(workout.Id, CancellationToken.None));
  }

  [Fact]
  public async Task Update_changes_only_authenticated_users_workout()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var workout = WorkoutFor(userId, "Old name");
    db.Workouts.Add(workout);
    await db.SaveChangesAsync();
    var handler = new UpdateWHandler(db, new FixedUserContext(userId));

    var response = await handler.HandleAsync(
      workout.Id,
      new UpdateWRequest
      {
        Name = "New name",
        Description = "Updated description"
      },
      CancellationToken.None);

    Assert.Equal("New name", response.Name);
    Assert.Equal("Updated description", workout.Description);
    Assert.Equal(userId, workout.UserId);
  }

  [Fact]
  public async Task Delete_removes_authenticated_users_workout()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var workout = WorkoutFor(userId, "Delete me");
    db.Workouts.Add(workout);
    await db.SaveChangesAsync();
    var handler = new DeleteWHandler(db, new FixedUserContext(userId));

    await handler.HandleAsync(workout.Id, CancellationToken.None);

    Assert.False(await db.Workouts.AnyAsync());
  }

  private static Workout WorkoutFor(Guid userId, string name)
  {
    return new Workout
    {
      UserId = userId,
      Name = name,
      Description = string.Empty
    };
  }
}
