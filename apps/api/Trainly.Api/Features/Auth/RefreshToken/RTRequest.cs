namespace Trainly.Api.Features.Auth.RefreshToken;

public sealed class RTRequest
{
  public string RefreshToken { get; set; } = string.Empty;
}