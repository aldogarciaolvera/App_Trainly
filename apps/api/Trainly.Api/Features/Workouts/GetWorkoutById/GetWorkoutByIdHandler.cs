using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Workouts.GetWorkoutById;

public sealed class GetWorkoutByIdHandler
{
  private readonly AppDbContext _db;

  public GetWorkoutByIdHandler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<GetWorkoutByIdResponse> HandleAsync(Guid id, CancellationToken cancellationToken)
  {
    var workout = await _db.Workouts.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

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