using Trainly.Api.Common.Entities;

namespace Trainly.Api.Features.Models;

public class User : BaseEntity
{
  public string Name { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string PasswordHash { get; set; } = string.Empty;
  public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}