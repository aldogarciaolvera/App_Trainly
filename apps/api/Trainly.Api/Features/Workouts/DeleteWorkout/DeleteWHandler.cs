using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Workouts.DeleteWorkout;

public sealed class DeleteWHandler
{
  private readonly AppDbContext _db;

  public DeleteWHandler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<DeleteWResponse> HandleAsync(Guid id, CancellationToken cancellationToken)
  {
    var workout = await _db.Workouts.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    if (workout is null)
    {
      throw new NotFoundException("Workout no encontrado.");
    }

    _db.Workouts.Remove(workout);

    await _db.SaveChangesAsync(cancellationToken);

    return new DeleteWResponse
    {
      Id = workout.Id
    };
  }
}