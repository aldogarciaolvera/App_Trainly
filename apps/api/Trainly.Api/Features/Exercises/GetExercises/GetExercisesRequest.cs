using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Exercises.GetExercises;

public sealed class GetExercisesRequest
{
  public int Page { get; set; } = 1;
  public int PageSize { get; set; } = 20;
  public string? Search { get; set; }
  public MuscleGroup? MuscleGroup { get; set; }
  public ExerciseScope Scope { get; set; } = ExerciseScope.All;
}
