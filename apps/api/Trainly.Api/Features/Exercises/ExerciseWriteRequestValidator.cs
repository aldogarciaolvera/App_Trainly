using FluentValidation;

namespace Trainly.Api.Features.Exercises;

public sealed class ExerciseWriteRequestValidator : AbstractValidator<ExerciseWriteRequest>
{
  public ExerciseWriteRequestValidator()
  {
    RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    RuleFor(x => x.MuscleGroup).NotNull().IsInEnum();
    RuleFor(x => x.Description).NotNull().MaximumLength(1000);
    RuleFor(x => x.Instructions).NotNull().MaximumLength(2000);
  }
}
