using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Trainly.Api.Database;

namespace Trainly.Api.Configuration;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<DatabaseOptions>(configuration.GetSection("Database"));

        services.AddDbContext<AppDbContext>((sp, options) =>
        {
            var dbOptions = sp.GetRequiredService<IOptions<DatabaseOptions>>().Value;
            options.UseNpgsql(dbOptions.BuildConnectionString());
        });

        return services;
    }
}