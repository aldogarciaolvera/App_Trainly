using FluentValidation;

namespace Trainly.Api.Features.Exercises.GetExercises;

public sealed class GetExercisesRequestValidator : AbstractValidator<GetExercisesRequest>
{
  public GetExercisesRequestValidator()
  {
    RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
    RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    RuleFor(x => x.Search).MaximumLength(100);
    RuleFor(x => x.MuscleGroup).IsInEnum().When(x => x.MuscleGroup.HasValue);
    RuleFor(x => x.Scope).IsInEnum();
  }
}
