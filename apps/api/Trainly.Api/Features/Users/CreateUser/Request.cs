namespace Trainly.Api.Features.Users.CreateUser;

public sealed class Request
{
  public string Name { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
}