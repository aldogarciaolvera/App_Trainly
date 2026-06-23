namespace Trainly.Api.Features.WorkoutExercises;

public sealed class WorkoutExerciseResponse
{
  public Guid Id { get; set; }
  public Guid ExerciseId { get; set; }
  public string ExerciseName { get; set; } = string.Empty;
  public string MuscleGroup { get; set; } = string.Empty;
  public bool IsGlobal { get; set; }
  public int Order { get; set; }
  public int Sets { get; set; }
  public int Reps { get; set; }
  public int RestSeconds { get; set; }
  public string Notes { get; set; } = string.Empty;
}
