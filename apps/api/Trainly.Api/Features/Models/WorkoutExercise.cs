using Trainly.Api.Common.Entities;

namespace Trainly.Api.Features.Models;

public sealed class WorkoutExercise : BaseEntity
{
  public Guid WorkoutId { get; set; }
  public Guid ExerciseId { get; set; }
  public int Order { get; set; }
  public int Sets { get; set; }
  public int Reps { get; set; }
  public int RestSeconds { get; set; }
  public string Notes { get; set; } = string.Empty;
  public Workout Workout { get; set; } = null!;
  public Exercise Exercise { get; set; } = null!;
}
