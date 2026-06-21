namespace Trainly.Api.Features.Workouts.GetWorkoutById;

public sealed class GetWorkoutByIdResponse
{
  public Guid Id { get; set; }
  public Guid UserId { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
}