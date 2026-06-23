namespace Trainly.Api.Features.Workouts.CreateWorkout;

public sealed class CreateWResponse
{
	public Guid Id { get; set; }
	public Guid UserId { get; set; }
	public string Name { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
}
