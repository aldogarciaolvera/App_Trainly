using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Database.Configurations;

public sealed class WorkoutExerciseConfiguration : IEntityTypeConfiguration<WorkoutExercise>
{
  public void Configure(EntityTypeBuilder<WorkoutExercise> builder)
  {
    builder.HasKey(x => x.Id);
    builder.Property(x => x.Notes).IsRequired().HasMaxLength(500);
    builder.HasOne(x => x.Workout)
      .WithMany(x => x.Exercises)
      .HasForeignKey(x => x.WorkoutId)
      .OnDelete(DeleteBehavior.Cascade);
    builder.HasOne(x => x.Exercise)
      .WithMany(x => x.Workouts)
      .HasForeignKey(x => x.ExerciseId)
      .OnDelete(DeleteBehavior.Cascade);
    builder.HasIndex(x => new { x.WorkoutId, x.Order }).IsUnique();
    builder.HasIndex(x => new { x.WorkoutId, x.ExerciseId }).IsUnique();
    builder.HasIndex(x => x.ExerciseId);
  }
}
