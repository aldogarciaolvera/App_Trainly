using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;
using Trainly.Api.Features.Users.Models;
using Trainly.Api.Common.Security;

namespace Trainly.Api.Features.Auth.Register;

public sealed class Handler
{
  private readonly AppDbContext _db;
  private readonly IPasswordHasher _passwordHasher;

  public Handler(AppDbContext db, IPasswordHasher passwordHasher)
  {
    _db = db;
    _passwordHasher = passwordHasher;
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
      PasswordHash = _passwordHasher.Hash(request.Password),
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