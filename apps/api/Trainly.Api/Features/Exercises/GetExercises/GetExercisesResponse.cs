namespace Trainly.Api.Features.Exercises.GetExercises;

public sealed class GetExercisesResponse
{
  public List<GetExercisesItem> Items { get; set; } = [];
  public int Total { get; set; }
  public int Page { get; set; }
  public int PageSize { get; set; }
}
