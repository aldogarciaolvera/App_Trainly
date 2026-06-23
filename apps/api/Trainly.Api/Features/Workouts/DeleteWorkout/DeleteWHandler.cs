using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Workouts.DeleteWorkout;

public sealed class DeleteWHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public DeleteWHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task HandleAsync(Guid id, CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();

    var workout = await _db.Workouts.FirstOrDefaultAsync(
      x => x.Id == id && x.UserId == userId,
      cancellationToken);

    if (workout is null)
    {
      throw new NotFoundException("Workout no encontrado.");
    }

    _db.Workouts.Remove(workout);

    await _db.SaveChangesAsync(cancellationToken);
  }
}
