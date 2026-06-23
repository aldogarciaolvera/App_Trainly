using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Database.Configurations;

public sealed class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
{
  public void Configure(EntityTypeBuilder<Exercise> builder)
  {
    builder.HasKey(x => x.Id);
    builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
    builder.Property(x => x.MuscleGroup)
      .HasConversion<string>()
      .IsRequired()
      .HasMaxLength(30);
    builder.Property(x => x.Description).IsRequired().HasMaxLength(1000);
    builder.Property(x => x.Instructions).IsRequired().HasMaxLength(2000);
    builder.HasOne(x => x.User)
      .WithMany(x => x.Exercises)
      .HasForeignKey(x => x.UserId)
      .OnDelete(DeleteBehavior.Cascade);
    builder.HasIndex(x => x.UserId);
    builder.HasIndex(x => new { x.MuscleGroup, x.Name });
  }
}
