using Trainly.Api.Common.Exceptions;
using Trainly.Api.Features.Models;
using Trainly.Api.Features.Users.GetCurrentUser;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Users;

public sealed class GetCurrentUserTests
{
  [Fact]
  public async Task Get_current_returns_authenticated_users_profile()
  {
    await using var db = TestDbContextFactory.Create();
    var authenticatedUser = new User
    {
      Name = "Ana",
      Email = "ana@trainly.test",
      PasswordHash = "not-used-in-this-test"
    };
    var otherUser = new User
    {
      Name = "Other",
      Email = "other@trainly.test",
      PasswordHash = "not-used-in-this-test"
    };
    db.Users.AddRange(authenticatedUser, otherUser);
    await db.SaveChangesAsync();
    var handler = new GetCurrentUserHandler(
      db,
      new FixedUserContext(authenticatedUser.Id));

    var response = await handler.HandleAsync(CancellationToken.None);

    Assert.Equal(authenticatedUser.Id, response.Id);
    Assert.Equal("Ana", response.Name);
    Assert.Equal("ana@trainly.test", response.Email);
  }

  [Fact]
  public async Task Get_current_throws_when_authenticated_user_no_longer_exists()
  {
    await using var db = TestDbContextFactory.Create();
    var handler = new GetCurrentUserHandler(
      db,
      new FixedUserContext(Guid.NewGuid()));

    await Assert.ThrowsAsync<NotFoundException>(() =>
      handler.HandleAsync(CancellationToken.None));
  }
}
