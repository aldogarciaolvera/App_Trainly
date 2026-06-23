using Microsoft.EntityFrameworkCore;
using Trainly.Api.Database;

namespace Trainly.Api.Tests.TestInfrastructure;

internal static class TestDbContextFactory
{
  public static AppDbContext Create()
  {
    var options = new DbContextOptionsBuilder<AppDbContext>()
      .UseInMemoryDatabase(Guid.NewGuid().ToString())
      .Options;

    return new AppDbContext(options);
  }
}
