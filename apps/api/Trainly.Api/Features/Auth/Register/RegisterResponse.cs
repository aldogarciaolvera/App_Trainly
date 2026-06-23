namespace Trainly.Api.Features.Auth.Register;

public sealed class RegisterResponse
{
  public Guid Id { get; set; }
  public string Token { get; set; } = string.Empty;
}