using Microsoft.EntityFrameworkCore;
using Trainly.Api.Features.Models;
using Trainly.Api.Common.Entities;

namespace Trainly.Api.Database;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
  public DbSet<User> Users => Set<User>();
  public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
    builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
  }

  public override Task<int> SaveChangesAsync(
    CancellationToken cancellationToken = default)
  {
    UpdateAuditableEntities();

    return base.SaveChangesAsync(cancellationToken);
  }

  private void UpdateAuditableEntities()
  {
    var entries = ChangeTracker.Entries<BaseEntity>();

    foreach (var entry in entries)
    {
      if (entry.State == EntityState.Added)
      {
        if (entry.Entity.Id == Guid.Empty)
        {
          entry.Entity.Id = Guid.NewGuid();
        }
        entry.Entity.CreatedAt = DateTime.UtcNow;
        entry.Entity.UpdatedAt = DateTime.UtcNow;
      }

      if (entry.State == EntityState.Modified)
      {
        entry.Entity.UpdatedAt = DateTime.UtcNow;
      }
    }
  }

}