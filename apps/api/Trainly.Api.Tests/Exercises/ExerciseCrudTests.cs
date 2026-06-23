using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Features.Exercises;
using Trainly.Api.Features.Exercises.CreateExercise;
using Trainly.Api.Features.Exercises.DeleteExercise;
using Trainly.Api.Features.Exercises.GetExerciseById;
using Trainly.Api.Features.Exercises.GetExercises;
using Trainly.Api.Features.Exercises.UpdateExercise;
using Trainly.Api.Features.Models;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Exercises;

public sealed class ExerciseCrudTests
{
  [Fact]
  public async Task Create_assigns_authenticated_user_as_owner()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var handler = new CreateExerciseHandler(db, new FixedUserContext(userId));

    var response = await handler.HandleAsync(RequestFor("Mine"), CancellationToken.None);

    var stored = await db.Exercises.SingleAsync();
    Assert.Equal(userId, stored.UserId);
    Assert.False(response.IsGlobal);
  }

  [Fact]
  public async Task List_filters_scope_group_search_and_owner()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    db.Exercises.AddRange(
      ExerciseFor(null, "Global press", MuscleGroup.Chest),
      ExerciseFor(userId, "Custom press", MuscleGroup.Chest),
      ExerciseFor(userId, "Custom row", MuscleGroup.Back),
      ExerciseFor(Guid.NewGuid(), "Private press", MuscleGroup.Chest));
    await db.SaveChangesAsync();
    var handler = new GetExercisesHandler(db, new FixedUserContext(userId));

    var response = await handler.HandleAsync(
      new GetExercisesRequest
      {
        Page = 1,
        PageSize = 20,
        Search = "press",
        MuscleGroup = MuscleGroup.Chest,
        Scope = ExerciseScope.All
      },
      CancellationToken.None);

    Assert.Equal(2, response.Total);
    Assert.Contains(response.Items, x => x.Name == "Global press" && x.IsGlobal);
    Assert.Contains(response.Items, x => x.Name == "Custom press" && !x.IsGlobal);
  }

  [Fact]
  public async Task Get_by_id_allows_global_but_hides_other_users_custom_exercise()
  {
    await using var db = TestDbContextFactory.Create();
    var global = ExerciseFor(null, "Global", MuscleGroup.Other);
    var other = ExerciseFor(Guid.NewGuid(), "Private", MuscleGroup.Other);
    db.Exercises.AddRange(global, other);
    await db.SaveChangesAsync();
    var handler = new GetExerciseByIdHandler(db, new FixedUserContext(Guid.NewGuid()));

    var response = await handler.HandleAsync(global.Id, CancellationToken.None);

    Assert.True(response.IsGlobal);
    await Assert.ThrowsAsync<NotFoundException>(() =>
      handler.HandleAsync(other.Id, CancellationToken.None));
  }

  [Fact]
  public async Task Update_does_not_modify_global_exercise()
  {
    await using var db = TestDbContextFactory.Create();
    var global = ExerciseFor(null, "Global", MuscleGroup.Other);
    db.Exercises.Add(global);
    await db.SaveChangesAsync();
    var handler = new UpdateExerciseHandler(db, new FixedUserContext(Guid.NewGuid()));

    await Assert.ThrowsAsync<NotFoundException>(() =>
      handler.HandleAsync(global.Id, RequestFor("Changed"), CancellationToken.None));
    Assert.Equal("Global", global.Name);
  }

  [Fact]
  public async Task Delete_removes_only_authenticated_users_custom_exercise()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    var own = ExerciseFor(userId, "Mine", MuscleGroup.Other);
    var other = ExerciseFor(Guid.NewGuid(), "Other", MuscleGroup.Other);
    db.Exercises.AddRange(own, other);
    await db.SaveChangesAsync();
    var handler = new DeleteExerciseHandler(db, new FixedUserContext(userId));

    await handler.HandleAsync(own.Id, CancellationToken.None);

    Assert.False(await db.Exercises.AnyAsync(x => x.Id == own.Id));
    Assert.True(await db.Exercises.AnyAsync(x => x.Id == other.Id));
  }

  private static ExerciseWriteRequest RequestFor(string name) => new()
  {
    Name = name,
    MuscleGroup = MuscleGroup.Other,
    Description = string.Empty,
    Instructions = string.Empty
  };

  private static Exercise ExerciseFor(Guid? userId, string name, MuscleGroup group) => new()
  {
    UserId = userId,
    Name = name,
    MuscleGroup = group,
    Description = string.Empty,
    Instructions = string.Empty
  };
}
