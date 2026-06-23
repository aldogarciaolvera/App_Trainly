namespace Trainly.Api.Features.WorkoutExercises;

public sealed class WorkoutExerciseWriteRequest
{
  public Guid ExerciseId { get; set; }
  public int Order { get; set; }
  public int Sets { get; set; }
  public int Reps { get; set; }
  public int RestSeconds { get; set; }
  public string Notes { get; set; } = string.Empty;
}
