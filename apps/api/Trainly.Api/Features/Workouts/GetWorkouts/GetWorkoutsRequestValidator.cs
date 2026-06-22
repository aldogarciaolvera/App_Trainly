using FluentValidation;

namespace Trainly.Api.Features.Workouts.GetWorkouts;

public sealed class GetWorkoutsRequestValidator : AbstractValidator<GetWorkoutsRequest>
{
  public GetWorkoutsRequestValidator()
  {
    RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
    RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
  }
}
