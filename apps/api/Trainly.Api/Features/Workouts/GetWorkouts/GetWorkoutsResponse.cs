namespace Trainly.Api.Features.Workouts.GetWorkouts;

public sealed class GetWorkoutsResponse
{
  public List<GetWorkoutsItem> Items { get; set; } = [];
  public int Total { get; set; }
}