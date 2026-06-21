using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Workouts.CreateWorkout;

public sealed class CreateWHandler
{
	private readonly AppDbContext _db;

	public CreateWHandler(AppDbContext db)
	{
		_db = db;
	}

	public async Task<CreateWResponse> HandleAsync(CreateWRequest request, CancellationToken cancellationToken)
	{
		var userExists = await _db.Users.AnyAsync(x => x.Id == request.UserId, cancellationToken);

		if (!userExists)
		{
			throw new NotFoundException("Usuario no encontrado.");
		}

		var workout = new Workout
		{
			UserId = request.UserId,
			Name = request.Name,
			Description = request.Description
		};

		_db.Workouts.Add(workout);

		await _db.SaveChangesAsync(cancellationToken);

		return new CreateWResponse
		{
			Id = workout.Id,
			UserId = workout.UserId,
			Name = workout.Name,
			Description = workout.Description
		};
	}
}
