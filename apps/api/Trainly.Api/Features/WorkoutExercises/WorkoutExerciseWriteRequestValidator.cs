using FluentValidation;

namespace Trainly.Api.Features.WorkoutExercises;

public sealed class WorkoutExerciseWriteRequestValidator : AbstractValidator<WorkoutExerciseWriteRequest>
{
  public WorkoutExerciseWriteRequestValidator()
  {
    RuleFor(x => x.ExerciseId).NotEmpty();
    RuleFor(x => x.Order).InclusiveBetween(1, 1000);
    RuleFor(x => x.Sets).InclusiveBetween(1, 100);
    RuleFor(x => x.Reps).InclusiveBetween(1, 1000);
    RuleFor(x => x.RestSeconds).InclusiveBetween(0, 3600);
    RuleFor(x => x.Notes).NotNull().MaximumLength(500);
  }
}
