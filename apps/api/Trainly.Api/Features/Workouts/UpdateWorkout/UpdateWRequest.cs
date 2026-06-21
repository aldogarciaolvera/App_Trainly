namespace Trainly.Api.Features.Workouts.UpdateWorkout;

public sealed class UpdateWRequest
{
  public Guid UserId { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
}