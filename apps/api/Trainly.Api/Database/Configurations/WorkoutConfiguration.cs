using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Database.Configurations;

public sealed class WorkoutConfiguration: IEntityTypeConfiguration<Workout>
{
  public void Configure(EntityTypeBuilder<Workout> builder)
  {
    builder.HasKey(x => x.Id);
    builder.Property(x => x.Name).HasMaxLength(100).IsRequired();
    builder.Property(x => x.Description).HasMaxLength(1000);
    builder.HasOne(x => x.User).WithMany(x => x.Workouts).HasForeignKey(x => x.UserId);
    builder.HasIndex(x => x.UserId);
  }
}