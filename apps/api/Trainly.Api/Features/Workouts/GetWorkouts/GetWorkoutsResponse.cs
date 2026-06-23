namespace Trainly.Api.Features.Workouts.GetWorkouts;

public sealed class GetWorkoutsResponse
{
  public List<GetWorkoutsItem> Items { get; set; } = [];
  public int Total { get; set; }
  public int Page { get; set; }
  public int PageSize { get; set; }
}
