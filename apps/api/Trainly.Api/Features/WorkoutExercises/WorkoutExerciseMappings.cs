using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.WorkoutExercises;

public static class WorkoutExerciseMappings
{
  public static WorkoutExerciseResponse ToResponse(this WorkoutExercise item)
  {
    return new WorkoutExerciseResponse
    {
      Id = item.Id,
      ExerciseId = item.ExerciseId,
      ExerciseName = item.Exercise.Name,
      MuscleGroup = item.Exercise.MuscleGroup.ToString(),
      IsGlobal = item.Exercise.UserId == null,
      Order = item.Order,
      Sets = item.Sets,
      Reps = item.Reps,
      RestSeconds = item.RestSeconds,
      Notes = item.Notes
    };
  }
}
