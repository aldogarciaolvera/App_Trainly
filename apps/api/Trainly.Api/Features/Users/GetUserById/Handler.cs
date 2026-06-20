using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;

namespace Trainly.Api.Features.Users.GetUserById;

public sealed class Handler
{
  private readonly AppDbContext _db;

  public Handler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<Response> HandleAsync(Guid id, CancellationToken cancellationToken)
  {
    var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    if (user is null)
    {
      throw new NotFoundException("Usuario no encontrado.");
    }

    return new Response
    {
      Id = user.Id,
      Name = user.Name,
      Email = user.Email,
      CreatedAt = user.CreatedAt,
      UpdatedAt = user.UpdatedAt
    };
  }
}