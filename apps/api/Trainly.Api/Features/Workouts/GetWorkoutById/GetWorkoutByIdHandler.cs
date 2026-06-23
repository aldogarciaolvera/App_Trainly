using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Workouts.GetWorkoutById;

public sealed class GetWorkoutByIdHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public GetWorkoutByIdHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<GetWorkoutByIdResponse> HandleAsync(Guid id, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();

    var workout = await _db.Workouts
      .AsNoTracking()
      .FirstOrDefaultAsync(
        x => x.Id == id && x.UserId == userId,
        cancellationToken);

    if (workout is null)
    {
      throw new NotFoundException("Workout no encontrado.");
    }

    return new GetWorkoutByIdResponse
    {
      Id = workout.Id,
      UserId = workout.UserId,
      Name = workout.Name,
      Description = workout.Description
    };
  }
}
