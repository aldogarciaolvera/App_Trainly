using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Trainly.Api.Database;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Configuration.Authentication;

public sealed class AdminBootstrapper
{
  private readonly AppDbContext _db;
  private readonly AdminBootstrapOptions _options;
  private readonly ILogger<AdminBootstrapper> _logger;

  public AdminBootstrapper(AppDbContext db, IOptions<AdminBootstrapOptions> options, ILogger<AdminBootstrapper> logger)
  {
    _db = db;
    _options = options.Value;
    _logger = logger;
  }

  public async Task PromoteFirstAdminAsync(CancellationToken cancellationToken)
  {
    var email = _options.Email.Trim();

    if (string.IsNullOrWhiteSpace(email))
    {
      return;
    }

    var adminExists = await _db.Users.AnyAsync(x => x.Role == UserRole.Admin, cancellationToken);

    if (adminExists)
    {
      _logger.LogInformation("Admin bootstrap skipped porque ya existe un administrador.");
      return;
    }

    var normalizedEmail = email.ToLower();
    var user = await _db.Users.FirstOrDefaultAsync(
      x => x.Email.ToLower() == normalizedEmail,
      cancellationToken);

    if (user is null)
    {
      _logger.LogWarning("Admin bootstrap no se pudo completar porque no se encontró un usuario con el correo electrónico especificado.");
      return;
    }

    user.Role = UserRole.Admin;
    await _db.SaveChangesAsync(cancellationToken);

    _logger.LogInformation("El primer Admin se ha promovido correctamente.");
  }
}
