using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Trainly.Api.Features.Auth.Login;
using Trainly.Api.Features.Models;
using Trainly.Api.Tests.TestInfrastructure;

namespace Trainly.Api.Tests.Auth;

public sealed class LoginTests
{
  [Fact]
  public async Task Login_returns_tokens_and_persists_refresh_token()
  {
    await using var db = TestDbContextFactory.Create();
    var user = UserWith("ana@trainly.test", "password123");
    db.Users.Add(user);
    await db.SaveChangesAsync();
    var handler = new LoginHandler(
      db,
      new StubPasswordHasher(),
      new StubTokenService(),
      new StubRefreshTokenGenerator("refresh-token"));

    var response = await handler.HandleAsync(
      new LoginRequest
      {
        Email = "ana@trainly.test",
        Password = "password123"
      },
      CancellationToken.None);

    var refreshToken = await db.RefreshTokens.SingleAsync();
    Assert.Equal($"access-token:{user.Id}", response.Token);
    Assert.Equal("refresh-token", response.RefreshToken);
    Assert.Equal(user.Id, refreshToken.UserId);
    Assert.False(refreshToken.IsRevoked);
  }

  [Fact]
  public async Task Login_rejects_invalid_password_without_creating_token()
  {
    await using var db = TestDbContextFactory.Create();
    db.Users.Add(UserWith("ana@trainly.test", "password123"));
    await db.SaveChangesAsync();
    var handler = new LoginHandler(
      db,
      new StubPasswordHasher(),
      new StubTokenService(),
      new StubRefreshTokenGenerator("refresh-token"));

    await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.HandleAsync(
      new LoginRequest
      {
        Email = "ana@trainly.test",
        Password = "incorrect-password"
      },
      CancellationToken.None));

    Assert.False(await db.RefreshTokens.AnyAsync());
  }

  [Fact]
  public void Login_validator_rejects_empty_credentials()
  {
    var validator = new LoginRequestValidator();

    var result = validator.Validate(new LoginRequest());

    Assert.False(result.IsValid);
    Assert.Contains(result.Errors, x => x.PropertyName == nameof(LoginRequest.Email));
    Assert.Contains(result.Errors, x => x.PropertyName == nameof(LoginRequest.Password));
  }

  private static User UserWith(string email, string password)
  {
    return new User
    {
      Name = "Ana",
      Email = email,
      PasswordHash = $"hashed:{password}"
    };
  }
}
