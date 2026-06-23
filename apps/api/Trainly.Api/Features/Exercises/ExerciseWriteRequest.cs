using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Exercises;

public sealed class ExerciseWriteRequest
{
  public string Name { get; set; } = string.Empty;
  public MuscleGroup? MuscleGroup { get; set; }
  public string Description { get; set; } = string.Empty;
  public string Instructions { get; set; } = string.Empty;
}
