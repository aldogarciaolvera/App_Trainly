using Microsoft.AspNetCore.Mvc;

namespace Trainly.Api.Features.Workouts.CreateWorkout;

[ApiController]
[Route("api/workouts")]
public sealed class WorkoutEndpoint : ControllerBase
{
	private readonly CreateWHandler _handler;

	public WorkoutEndpoint(CreateWHandler handler)
	{
		_handler = handler;
	}

	[HttpPost]
	public async Task<ActionResult<CreateWResponse>> Create(CreateWRequest request, CancellationToken cancellationToken)
	{
		var response = await _handler.HandleAsync(request, cancellationToken);

		return Created($"/api/workouts/{response.Id}", response);
	}
}
