using Microsoft.EntityFrameworkCore;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Workouts.GetWorkouts;

public sealed class GetWorkoutsHandler
{
  private readonly AppDbContext _db;

  public GetWorkoutsHandler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<GetWorkoutsResponse> HandleAsync(CancellationToken cancellationToken)
  {
    var query = _db.Workouts.AsNoTracking();

    var total = await query.CountAsync(cancellationToken);

    var items = await query
      .OrderBy(x => x.Name)
      .Select(x => new GetWorkoutsItem
      {
        Id = x.Id,
        UserId = x.UserId,
        Name = x.Name,
        Description = x.Description
      })
      .ToListAsync(cancellationToken);

    return new GetWorkoutsResponse
    {
      Items = items,
      Total = total
    };
  }
}