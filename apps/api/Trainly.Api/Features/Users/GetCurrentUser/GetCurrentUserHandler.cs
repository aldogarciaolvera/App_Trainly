using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;
using Trainly.Api.Features.Users.GetUserById;

namespace Trainly.Api.Features.Users.GetCurrentUser;

public sealed class GetCurrentUserHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public GetCurrentUserHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<GetUserByIDResponse> HandleAsync(
    CancellationToken cancellationToken)
  {
    var userId = _userContext.GetUserId();

    var user = await _db.Users
      .AsNoTracking()
      .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

    if (user is null)
    {
      throw new NotFoundException("Usuario no encontrado.");
    }

    return new GetUserByIDResponse
    {
      Id = user.Id,
      Name = user.Name,
      Email = user.Email,
      Role = user.Role.ToString(),
      CreatedAt = user.CreatedAt,
      UpdatedAt = user.UpdatedAt
    };
  }
}
