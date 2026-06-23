using Trainly.Api.Common.Entities;

namespace Trainly.Api.Features.Models;

public sealed class Exercise : BaseEntity
{
  public Guid? UserId { get; set; }
  public string Name { get; set; } = string.Empty;
  public MuscleGroup MuscleGroup { get; set; }
  public string Description { get; set; } = string.Empty;
  public string Instructions { get; set; } = string.Empty;
  public User? User { get; set; }
  public ICollection<WorkoutExercise> Workouts { get; set; } = [];
}
