namespace Trainly.Api.Features.Workouts.CreateWorkout;

public sealed class CreateWRequest
{
	public string Name { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
}
