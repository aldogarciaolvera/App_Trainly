namespace Trainly.Api.Features.Auth.Login;

public sealed class LoginResponse
{
  public string Token { get; set; } = string.Empty;
  public string RefreshToken { get; set; } = string.Empty;
  public DateTime ExpiresAt { get; set; }
}