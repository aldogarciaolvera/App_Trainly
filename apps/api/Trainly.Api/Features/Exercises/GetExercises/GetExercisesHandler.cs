using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Database;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Exercises.GetExercises;

public sealed class GetExercisesHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public GetExercisesHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<GetExercisesResponse> HandleAsync(GetExercisesRequest request, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();
    var query = _db.Exercises.AsNoTracking().VisibleTo(userId);

    query = request.Scope switch
    {
      ExerciseScope.Global => query.Where(x => x.UserId == null),
      ExerciseScope.Custom => query.Where(x => x.UserId == userId),
      _ => query
    };

    if (request.MuscleGroup.HasValue)
    {
      query = query.Where(x => x.MuscleGroup == request.MuscleGroup.Value);
    }

    if (!string.IsNullOrWhiteSpace(request.Search))
    {
      var search = request.Search.Trim().ToLower();
      query = query.Where(x => x.Name.ToLower().Contains(search));
    }

    var total = await query.CountAsync(cancellationToken);
    var items = await query
      .OrderBy(x => x.Name)
      .ThenBy(x => x.Id)
      .Skip((request.Page - 1) * request.PageSize)
      .Take(request.PageSize)
      .Select(x => new GetExercisesItem
      {
        Id = x.Id,
        Name = x.Name,
        MuscleGroup = x.MuscleGroup.ToString(),
        Description = x.Description,
        Instructions = x.Instructions,
        IsGlobal = x.UserId == null
      })
      .ToListAsync(cancellationToken);

    return new GetExercisesResponse
    {
      Items = items,
      Total = total,
      Page = request.Page,
      PageSize = request.PageSize
    };
  }
}
