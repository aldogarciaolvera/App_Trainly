using Microsoft.EntityFrameworkCore;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Users.GetUsers;

public sealed class GetUsersHandler
{
  private readonly AppDbContext _db;

  public GetUsersHandler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<GetUsersResponse> HandleAsync(GetUsersRequest request, CancellationToken cancellationToken)
  {
    var query = _db.Users.AsNoTracking();

    var total = await query.CountAsync(cancellationToken);

    var users = await query
        .OrderBy(x => x.Name)
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .Select(x => new GetUsersUserItem
        {
          Id = x.Id,
          Name = x.Name,
          Email = x.Email
        })
        .ToListAsync(cancellationToken);

    return new GetUsersResponse
    {
      Items = users,
      Total = total,
      Page = request.Page,
      PageSize = request.PageSize
    };
  }
}