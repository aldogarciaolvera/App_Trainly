namespace Trainly.Api.Features.Workouts.UpdateWorkout;

public sealed class UpdateWRequest
{
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
}
