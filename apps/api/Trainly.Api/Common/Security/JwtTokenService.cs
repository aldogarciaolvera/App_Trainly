namespace Trainly.Api.Common.Security;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Trainly.Api.Configuration.Authentication;
using Trainly.Api.Features.Users.Models;

public sealed class JwtTokenService : ITokenService
{
  private readonly IOptions<JwtOptions> _options;

  public JwtTokenService(IOptions<JwtOptions> options)
  {
    _options = options;
  }

  public string GenerateToken(User user)
  {
    var opts = _options.Value;
    var claims = new List<Claim>
    {
      new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
      new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
      new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(opts.Key ?? string.Empty));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var expires = DateTime.UtcNow.AddMinutes(opts.ExpiresInMinutes > 0 ? opts.ExpiresInMinutes : 60);

    var token = new JwtSecurityToken(
      issuer: opts.Issuer,
      audience: opts.Audience,
      claims: claims,
      expires: expires,
      signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
