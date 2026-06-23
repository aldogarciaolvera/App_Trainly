using FluentValidation;

namespace Trainly.Api.Features.Users.GetUsers;

public sealed class GetUsersRequestValidator : AbstractValidator<GetUsersRequest>
{
  public GetUsersRequestValidator()
  {
    RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
    RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
  }
}
