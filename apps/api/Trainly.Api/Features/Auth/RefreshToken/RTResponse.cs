namespace Trainly.Api.Features.Auth.RefreshToken;

public sealed class RTResponse
{
  public string AccessToken { get; set; } = string.Empty;
  public string RefreshToken { get; set; } = string.Empty;
  public DateTime ExpiresAt { get; set; }
}