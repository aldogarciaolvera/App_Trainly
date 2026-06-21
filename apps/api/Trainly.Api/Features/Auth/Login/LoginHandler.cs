using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Trainly.Api.Common.Security;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Auth.Login;

public sealed class LoginHandler
{
  private readonly AppDbContext _db;
  private readonly IPasswordHasher _passwordHasher;
  private readonly ITokenService _jwtProvider;

  public LoginHandler(AppDbContext db, IPasswordHasher passwordHasher, ITokenService jwtProvider)
  {
    _db = db;
    _passwordHasher = passwordHasher;
    _jwtProvider = jwtProvider;
  }

  public async Task<LoginResponse> HandleAsync(LoginRequest request, CancellationToken cancellationToken)
  {
    var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

    if (user is null)
    {
      throw new UnauthorizedAccessException("Email o Contraseña inválidos.");
    }

    var passwordIsValid = _passwordHasher.Verify(request.Password, user.PasswordHash);

    if (!passwordIsValid)
    {
      throw new UnauthorizedAccessException("Email o Contraseña inválidos.");
    }

    var token = _jwtProvider.GenerateToken(user);
    
    var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

    return new LoginResponse
    {
      Token = token.AccessToken,
      RefreshToken = refreshToken,
      ExpiresAt = token.ExpiresAt,
    };
  }
}