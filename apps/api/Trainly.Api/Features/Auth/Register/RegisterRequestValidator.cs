using FluentValidation;

namespace Trainly.Api.Features.Auth.Register;

public sealed class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
  public RegisterRequestValidator()
  {
    RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    RuleFor(x => x.Email).NotEmpty().EmailAddress();
    RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
  }
}