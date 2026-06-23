namespace Trainly.Api.Common.Security;

public sealed class TokenResult
{
  public string AccessToken { get; set; } = string.Empty;
  public DateTime ExpiresAt { get; set; }
}