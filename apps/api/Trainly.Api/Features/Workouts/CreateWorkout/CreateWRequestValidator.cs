using FluentValidation;

namespace Trainly.Api.Features.Workouts.CreateWorkout;

public sealed class CreateWRequestValidator : AbstractValidator<CreateWRequest>
{
	public CreateWRequestValidator()
	{
		RuleFor(x => x.UserId).NotEmpty();
		RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
		RuleFor(x => x.Description).MaximumLength(1000);
	}
}
