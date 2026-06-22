using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Workouts.GetWorkouts;

public sealed class GetWorkoutsHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public GetWorkoutsHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<GetWorkoutsResponse> HandleAsync(CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();

    var query = _db.Workouts
      .AsNoTracking()
      .Where(x => x.UserId == userId);

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
