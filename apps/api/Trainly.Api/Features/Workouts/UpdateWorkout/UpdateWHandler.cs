using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Workouts.UpdateWorkout;

public sealed class UpdateWHandler
{
  private readonly AppDbContext _db;

  public UpdateWHandler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<UpdateWResponse> HandleAsync(Guid id, UpdateWRequest request, CancellationToken cancellationToken)
  {
    var workout = await _db.Workouts.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    if (workout is null)
    {
      throw new NotFoundException("Workout no encontrado.");
    }

    var userExists = await _db.Users.AnyAsync(x => x.Id == request.UserId, cancellationToken);

    if (!userExists)
    {
      throw new NotFoundException("Usuario no encontrado.");
    }

    workout.UserId = request.UserId;
    workout.Name = request.Name;
    workout.Description = request.Description;

    await _db.SaveChangesAsync(cancellationToken);

    return new UpdateWResponse
    {
      Id = workout.Id,
      UserId = workout.UserId,
      Name = workout.Name,
      Description = workout.Description,
      UpdatedAt = workout.UpdatedAt
    };
  }
}