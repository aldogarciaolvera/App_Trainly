using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Auth.Logout;

public sealed class LogoutHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public LogoutHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task HandleAsync(CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();

    var tokens = await _db.RefreshTokens
        .Where(x => x.UserId == userId && !x.IsRevoked)
        .ToListAsync(cancellationToken);

    foreach (var token in tokens)
    {
      token.IsRevoked = true;
      token.UpdatedAt = DateTime.UtcNow;
    }

    await _db.SaveChangesAsync(cancellationToken);
  }
}
