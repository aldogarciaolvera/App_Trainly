namespace Trainly.Api.Configuration.Authentication;

using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

public static class AuthenticationExtensions
{
  public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddJwtOptions(configuration);

    var jwtSection = configuration.GetSection("Jwt");
    var key = jwtSection.GetValue<string>("Key") ?? string.Empty;
    var issuer = jwtSection.GetValue<string>("Issuer") ?? string.Empty;
    var audience = jwtSection.GetValue<string>("Audience") ?? string.Empty;

    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

    services.AddAuthentication(options =>
    {
      options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
      options.RequireHttpsMetadata = true;
      options.SaveToken = true;
      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = signingKey,
        ValidateIssuer = !string.IsNullOrWhiteSpace(issuer),
        ValidIssuer = issuer,
        ValidateAudience = !string.IsNullOrWhiteSpace(audience),
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
      };
    });

    return services;
  }
}
