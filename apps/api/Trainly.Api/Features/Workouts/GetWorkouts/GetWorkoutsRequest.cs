namespace Trainly.Api.Features.Workouts.GetWorkouts;

public sealed class GetWorkoutsRequest
{
  public int Page { get; set; } = 1;
  public int PageSize { get; set; } = 20;
}
