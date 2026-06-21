using Trainly.Api.Common.Entities;

namespace Trainly.Api.Features.Models;

public sealed class Workout : BaseEntity
{
  public Guid UserId { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public User User { get; set; } = null!;
}