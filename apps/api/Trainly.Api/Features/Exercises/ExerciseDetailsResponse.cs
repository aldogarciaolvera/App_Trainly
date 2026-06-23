namespace Trainly.Api.Features.Exercises;

public sealed class ExerciseDetailsResponse
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string MuscleGroup { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string Instructions { get; set; } = string.Empty;
  public bool IsGlobal { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
}
