using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Database.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
  public void Configure(EntityTypeBuilder<User> builder)
  {
    builder.HasKey(x => x.Id);
    builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
    builder.Property(x => x.Email).IsRequired().HasMaxLength(255);
    builder.Property(x => x.PasswordHash).IsRequired();
    builder.HasIndex(x => x.Email).IsUnique();
    builder.HasMany(x => x.RefreshTokens).WithOne(x => x.User).HasForeignKey(x => x.UserId);
  }
}