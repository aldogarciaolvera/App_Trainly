using FluentValidation;

namespace Trainly.Api.Features.Auth.RefreshToken;

public sealed class RTRequestValidator : AbstractValidator<RTRequest>
{
  public RTRequestValidator()
  {
    RuleFor(x => x.RefreshToken).NotEmpty();
  }
}