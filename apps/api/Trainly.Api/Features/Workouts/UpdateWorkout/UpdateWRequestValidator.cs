using FluentValidation;

namespace Trainly.Api.Features.Workouts.UpdateWorkout;

public sealed class UpdateWRequestValidator : AbstractValidator<UpdateWRequest>
{
  public UpdateWRequestValidator()
  {
    RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    RuleFor(x => x.Description).MaximumLength(1000);
  }
}
