namespace Trainly.Api.Features.Auth.Register;

public sealed class Response
{
  public Guid Id { get; set; }
  public string Token { get; set; } = string.Empty;
}