using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Security;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Auth.RefreshToken;

public sealed class RTHandler
{
  private readonly AppDbContext _db;
  private readonly ITokenService _tokenService;
  private readonly IRefreshTokenGenerator _refreshTokenGenerator;

  public RTHandler(AppDbContext db, ITokenService tokenService, IRefreshTokenGenerator refreshTokenGenerator)
  {
    _db = db;
    _tokenService = tokenService;
    _refreshTokenGenerator = refreshTokenGenerator;
  }

  public async Task<RTResponse> HandleAsync(RTRequest request, CancellationToken cancellationToken)
  {
    var refreshToken = await _db.RefreshTokens
      .Include(x => x.User)
      .FirstOrDefaultAsync(x => x.Token == request.RefreshToken, cancellationToken);

    if (refreshToken is null)
    {
      throw new UnauthorizedAccessException("RefreshToken Invalido.");
    }

    if (refreshToken.IsRevoked)
    {
      throw new UnauthorizedAccessException("RefreshToken Revocado.");
    }

    if (refreshToken.ExpiresAt <= DateTime.UtcNow)
    {
      throw new UnauthorizedAccessException("RefreshToken Expirado.");
    }

    refreshToken.IsRevoked = true;
    refreshToken.UpdatedAt = DateTime.UtcNow;

    var tokenResult = _tokenService.GenerateToken(refreshToken.User);

    var newRefreshTokenValue = _refreshTokenGenerator.GenerateRefreshToken();

    var newRefreshToken = new Models.RefreshToken
    {
      Id = Guid.NewGuid(),
      UserId = refreshToken.UserId,
      Token = newRefreshTokenValue,
      ExpiresAt = DateTime.UtcNow.AddDays(30),
      IsRevoked = false,
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    _db.RefreshTokens.Add(newRefreshToken);

    await _db.SaveChangesAsync(cancellationToken);

    return new RTResponse
    {
      AccessToken = tokenResult.AccessToken,
      RefreshToken = newRefreshTokenValue,
      ExpiresAt = tokenResult.ExpiresAt
    };
  }

}