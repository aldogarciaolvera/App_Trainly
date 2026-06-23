using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Features.Exercises;
using Trainly.Api.Features.Exercises.Admin.CreateGlobalExercise;
using Trainly.Api.Features.Exercises.Admin.DeleteGlobalExercise;
using Trainly.Api.Features.Exercises.Admin.UpdateGlobalExercise;
using Trainly.Api.Features.Models;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Exercises;

public sealed class AdminExerciseCrudTests
{
  [Fact]
  public async Task Admin_create_always_creates_global_exercise()
  {
    await using var db = TestDbContextFactory.Create();
    var handler = new CreateGlobalExerciseHandler(db);

    var response = await handler.HandleAsync(RequestFor("Global"), CancellationToken.None);

    var stored = await db.Exercises.SingleAsync();
    Assert.Null(stored.UserId);
    Assert.True(response.IsGlobal);
  }

  [Fact]
  public async Task Admin_update_does_not_modify_custom_exercise()
  {
    await using var db = TestDbContextFactory.Create();
    var custom = ExerciseFor(Guid.NewGuid(), "Custom");
    db.Exercises.Add(custom);
    await db.SaveChangesAsync();
    var handler = new UpdateGlobalExerciseHandler(db);

    await Assert.ThrowsAsync<NotFoundException>(() =>
      handler.HandleAsync(custom.Id, RequestFor("Changed"), CancellationToken.None));
    Assert.Equal("Custom", custom.Name);
  }

  [Fact]
  public async Task Admin_delete_removes_global_and_preserves_custom_exercise()
  {
    await using var db = TestDbContextFactory.Create();
    var global = ExerciseFor(null, "Global");
    var custom = ExerciseFor(Guid.NewGuid(), "Custom");
    db.Exercises.AddRange(global, custom);
    await db.SaveChangesAsync();
    var handler = new DeleteGlobalExerciseHandler(db);

    await handler.HandleAsync(global.Id, CancellationToken.None);

    Assert.False(await db.Exercises.AnyAsync(x => x.Id == global.Id));
    Assert.True(await db.Exercises.AnyAsync(x => x.Id == custom.Id));
  }

  private static ExerciseWriteRequest RequestFor(string name) => new()
  {
    Name = name,
    MuscleGroup = MuscleGroup.Other,
    Description = string.Empty,
    Instructions = string.Empty
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
