namespace Trainly.Api.Features.Workouts.UpdateWorkout;

public sealed class UpdateWResponse
{
  public Guid Id { get; set; }
  public Guid UserId { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public DateTime UpdatedAt { get; set; }
}