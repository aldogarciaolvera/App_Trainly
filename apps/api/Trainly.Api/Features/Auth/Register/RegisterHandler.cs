using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Exceptions;
using Trainly.Api.Database;
using Trainly.Api.Common.Security;

namespace Trainly.Api.Features.Auth.Register;

public sealed class RegisterHandler
{
  private readonly AppDbContext _db;
  private readonly IPasswordHasher _passwordHasher;
  private readonly ITokenService _tokenService;

  public RegisterHandler(AppDbContext db, IPasswordHasher passwordHasher, ITokenService tokenService)
  {
    _db = db;
    _passwordHasher = passwordHasher;
    _tokenService = tokenService;
  }

  public async Task<RegisterResponse> HandleAsync(RegisterRequest request, CancellationToken cancellationToken)
  {
    var emailExists = await _db.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);

    if (emailExists)
    {
      throw new ConflictException("Email ya existe.");
    }

    var user = new Models.User
    {
      Name = request.Name,
      Email = request.Email,
      PasswordHash = _passwordHasher.Hash(request.Password),
      Role = Models.UserRole.User
    };

    _db.Users.Add(user);

    await _db.SaveChangesAsync(cancellationToken);

    var token = _tokenService.GenerateToken(user);

    return new RegisterResponse
    {
      Id = user.Id,
      Token = token.AccessToken
    };
  }
}
