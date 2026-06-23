using Trainly.Api.Common.Authentication;

namespace Trainly.Api.Tests.TestInfrastructure;

internal sealed class FixedUserContext : IUserContext
{
  private readonly Guid _userId;

  public FixedUserContext(Guid userId)
  {
    _userId = userId;
  }

  public Guid GetUserId() => _userId;
}
