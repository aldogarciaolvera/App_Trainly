using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Exercises;

public static class ExerciseQueryExtensions
{
  public static IQueryable<Exercise> VisibleTo(
    this IQueryable<Exercise> query,
    Guid userId)
  {
    return query.Where(x => x.UserId == null || x.UserId == userId);
  }
}
