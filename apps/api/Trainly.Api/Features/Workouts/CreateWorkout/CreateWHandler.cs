using Trainly.Api.Common.Authentication;
using Trainly.Api.Database;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Workouts.CreateWorkout;

public sealed class CreateWHandler
{
	private readonly AppDbContext _db;
	private readonly IUserContext _userContext;

	public CreateWHandler(AppDbContext db, IUserContext userContext)
	{
		_db = db;
		_userContext = userContext;
	}

	public async Task<CreateWResponse> HandleAsync(CreateWRequest request, CancellationToken cancellationToken)
	{
		var userId = _userContext.GetUserId();

		var workout = new Workout
		{
			UserId = userId,
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
