using Microsoft.EntityFrameworkCore;
using Trainly.Api.Features.Exercises;
using Trainly.Api.Features.Models;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Exercises;

public sealed class ExerciseVisibilityTests
{
  [Fact]
  public async Task Visible_to_returns_global_and_authenticated_users_exercises()
  {
    await using var db = TestDbContextFactory.Create();
    var userId = Guid.NewGuid();
    db.Exercises.AddRange(
      ExerciseFor(null, "Global"),
      ExerciseFor(userId, "Mine"),
      ExerciseFor(Guid.NewGuid(), "Private"));
    await db.SaveChangesAsync();

    var exercises = await db.Exercises
      .AsNoTracking()
      .VisibleTo(userId)
      .OrderBy(x => x.Name)
      .ToListAsync();

    Assert.Equal(2, exercises.Count);
    Assert.Contains(exercises, x => x.Name == "Global");
    Assert.Contains(exercises, x => x.Name == "Mine");
    Assert.DoesNotContain(exercises, x => x.Name == "Private");
  }

  [Fact]
  public void User_relationship_uses_cascade_delete()
  {
    using var db = TestDbContextFactory.Create();

    var entityType = db.Model.FindEntityType(typeof(Exercise));
    var foreignKey = Assert.Single(entityType!.GetForeignKeys());

    Assert.Equal(DeleteBehavior.Cascade, foreignKey.DeleteBehavior);
    Assert.False(foreignKey.IsRequired);
  }

  private static Exercise ExerciseFor(Guid? userId, string name)
  {
    return new Exercise
    {
      UserId = userId,
      Name = name,
      MuscleGroup = MuscleGroup.Other,
      Description = string.Empty,
      Instructions = string.Empty
    };
  }
}
