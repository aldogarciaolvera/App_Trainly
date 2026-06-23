using FluentValidation;
using FluentValidation.AspNetCore;

namespace Trainly.Api.Configuration.Validation;

public static class ValidationExtensions
{
  public static IServiceCollection AddValidation(this IServiceCollection services)
  {
    services.AddFluentValidationAutoValidation();
    services.AddValidatorsFromAssemblyContaining<Features.Auth.Register.RegisterRequestValidator>();

    return services;
  }
}