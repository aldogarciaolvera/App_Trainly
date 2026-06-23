namespace Trainly.Api.Features.Exercises.GetExercises;

public sealed class GetExercisesItem
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string MuscleGroup { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string Instructions { get; set; } = string.Empty;
  public bool IsGlobal { get; set; }
}
