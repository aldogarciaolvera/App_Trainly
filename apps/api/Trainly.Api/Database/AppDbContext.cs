using Microsoft.EntityFrameworkCore;
using Trainly.Api.Features.Users.Models;

namespace Trainly.Api.Database;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<User> Users => Set<User>();
}