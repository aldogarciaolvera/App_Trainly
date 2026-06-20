namespace Trainly.Api.Features.Users.GetUsers;

public sealed class UserItem
  {
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
  }