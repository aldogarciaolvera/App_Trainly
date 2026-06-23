namespace Trainly.Api.Configuration.Database;

public static class DatabaseOptionsExtensions
{
  public static string BuildConnectionString(this DatabaseOptions options)
  {
    return
      $"Host={options.Host};" +
      $"Port={options.Port};" +
      $"Database={options.Database};" +
      $"Username={options.Username};" +
      $"Password={options.Password}";
  }
}