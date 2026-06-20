using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;
using Trainly.Api.Features.Users.Models;

namespace Trainly.Api.Features.Users.CreateUser;

public sealed class Handler
{
  private readonly AppDbContext _db;

  public Handler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<Response> HandleAsync(Request request, CancellationToken cancellationToken)
  {
    var emailExists = await _db.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);

    if (emailExists)
    {
      throw new ConflictException("Email ya existe.");
    }

    var user = new User
    {
      Id = Guid.NewGuid(),
      Name = request.Name,
      Email = request.Email,
      // Temporal
      PasswordHash = request.Password,
      // End Temporal
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    _db.Users.Add(user);

    await _db.SaveChangesAsync(cancellationToken);

    return new Response
    {
      Id = user.Id
    };
  }
}