using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Trainly.Api.Common.Security;
using Trainly.Api.Configuration.Authentication;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Tests.Auth;

public sealed class JwtTokenServiceTests
{
  [Fact]
  public void Generate_token_emits_role_recognized_by_authorization()
  {
    const string key = "trainly-tests-signing-key-with-at-least-32-bytes";
    const string issuer = "TrainlyTests";
    const string audience = "TrainlyClientTests";
    var options = Options.Create(new JwtOptions
    {
      Key = key,
      Issuer = issuer,
      Audience = audience,
      ExpiresInMinutes = 60
    });
    var service = new JwtTokenService(options);
    var user = new User
    {
      Id = Guid.NewGuid(),
      Name = "Admin",
      Email = "admin@trainly.test",
      PasswordHash = "not-used-in-this-test",
      Role = UserRole.Admin
    };

    var result = service.GenerateToken(user);
    var principal = new JwtSecurityTokenHandler().ValidateToken(
      result.AccessToken,
      new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
      },
      out _);

    Assert.True(principal.IsInRole("Admin"));
  }
}
