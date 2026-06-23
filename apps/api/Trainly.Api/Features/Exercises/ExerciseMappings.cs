using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Exercises;

public static class ExerciseMappings
{
  public static ExerciseDetailsResponse ToDetails(this Exercise exercise)
  {
    return new ExerciseDetailsResponse
    {
      Id = exercise.Id,
      Name = exercise.Name,
      MuscleGroup = exercise.MuscleGroup.ToString(),
      Description = exercise.Description,
      Instructions = exercise.Instructions,
      IsGlobal = exercise.UserId == null,
      CreatedAt = exercise.CreatedAt,
      UpdatedAt = exercise.UpdatedAt
    };
  }
}
