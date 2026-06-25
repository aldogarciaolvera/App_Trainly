using Microsoft.EntityFrameworkCore;
using Trainly.Api.Database;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Configuration.Seed;

public sealed class ExerciseCatalogSeeder
{
  private readonly AppDbContext _db;
  private readonly ILogger<ExerciseCatalogSeeder> _logger;

  public ExerciseCatalogSeeder(AppDbContext db, ILogger<ExerciseCatalogSeeder> logger)
  {
    _db = db;
    _logger = logger;
  }

  public async Task SeedAsync(CancellationToken cancellationToken)
  {
    var existingKeys = await _db.Exercises
      .AsNoTracking()
      .Where(x => x.UserId == null)
      .Select(x => new ExerciseCatalogKey(x.MuscleGroup, x.Name))
      .ToListAsync(cancellationToken);

    var existing = existingKeys
      .Select(GetKey)
      .ToHashSet(StringComparer.OrdinalIgnoreCase);

    var now = DateTime.UtcNow;
    var missing = InitialCatalog
      .Where(x => !existing.Contains(GetKey(x.MuscleGroup, x.Name)))
      .Select(x => new Exercise
      {
        Id = Guid.NewGuid(),
        UserId = null,
        Name = x.Name,
        MuscleGroup = x.MuscleGroup,
        Description = x.Description,
        Instructions = x.Instructions,
        CreatedAt = now,
        UpdatedAt = now
      })
      .ToList();

    if (missing.Count == 0)
    {
      _logger.LogInformation("Global exercise catalog seed skipped. No missing exercises found.");
      return;
    }

    _db.Exercises.AddRange(missing);
    await _db.SaveChangesAsync(cancellationToken);

    _logger.LogInformation("Global exercise catalog seed added {Count} exercises.", missing.Count);
  }

  private static string GetKey(ExerciseCatalogKey item) => GetKey(item.MuscleGroup, item.Name);

  private static string GetKey(MuscleGroup muscleGroup, string name)
  {
    return $"{muscleGroup}:{name.Trim()}";
  }

  private sealed record ExerciseCatalogKey(MuscleGroup MuscleGroup, string Name);

  private sealed record ExerciseCatalogItem(
    string Name,
    MuscleGroup MuscleGroup,
    string Description,
    string Instructions);

  private static readonly ExerciseCatalogItem[] InitialCatalog =
  [
    new(
      "Bench Press",
      MuscleGroup.Chest,
      "Compound chest press performed with a barbell.",
      "Lie on the bench, keep your feet planted, lower the bar under control to the chest, and press upward without losing shoulder stability."),
    new(
      "Incline Dumbbell Press",
      MuscleGroup.Chest,
      "Upper-chest press using dumbbells on an incline bench.",
      "Set the bench to a moderate incline, lower the dumbbells near the upper chest, and press up while keeping wrists stacked."),
    new(
      "Push-Up",
      MuscleGroup.Chest,
      "Bodyweight horizontal press for chest, shoulders, triceps, and core.",
      "Keep a straight body line, lower until the chest approaches the floor, and press back up while bracing the core."),
    new(
      "Pull-Up",
      MuscleGroup.Back,
      "Vertical pulling movement using bodyweight.",
      "Hang from the bar, pull the chest toward the bar, keep the shoulders controlled, and lower with control."),
    new(
      "Barbell Row",
      MuscleGroup.Back,
      "Horizontal pulling movement for the back.",
      "Hinge at the hips, keep a neutral spine, pull the bar toward the torso, and lower it under control."),
    new(
      "Lat Pulldown",
      MuscleGroup.Back,
      "Machine-based vertical pull for the lats and upper back.",
      "Grip the bar, pull it toward the upper chest, keep the torso stable, and return slowly."),
    new(
      "Shoulder Press",
      MuscleGroup.Shoulders,
      "Overhead press for shoulders and triceps.",
      "Brace the core, press the weight overhead, avoid excessive lower-back arching, and lower under control."),
    new(
      "Lateral Raise",
      MuscleGroup.Shoulders,
      "Isolation movement for the side delts.",
      "Raise the dumbbells to shoulder height with a slight elbow bend, pause briefly, and lower with control."),
    new(
      "Biceps Curl",
      MuscleGroup.Biceps,
      "Isolation curl for the biceps.",
      "Keep elbows close to the torso, curl the weight without swinging, squeeze at the top, and lower slowly."),
    new(
      "Triceps Pushdown",
      MuscleGroup.Triceps,
      "Cable isolation movement for the triceps.",
      "Keep elbows pinned near the body, extend the arms fully, and return without letting the shoulders drift forward."),
    new(
      "Back Squat",
      MuscleGroup.Quadriceps,
      "Compound lower-body squat using a barbell.",
      "Brace, descend with control, keep the knees tracking over the toes, and drive upward through the midfoot."),
    new(
      "Leg Press",
      MuscleGroup.Quadriceps,
      "Machine-based lower-body press.",
      "Place feet firmly on the platform, lower the sled under control, and press without locking the knees aggressively."),
    new(
      "Romanian Deadlift",
      MuscleGroup.Hamstrings,
      "Hip-hinge movement focused on hamstrings and glutes.",
      "Keep a soft knee bend, hinge at the hips, lower the weight close to the legs, and stand tall by driving the hips forward."),
    new(
      "Hip Thrust",
      MuscleGroup.Glutes,
      "Glute-focused hip extension movement.",
      "Place the upper back on a bench, drive through the heels, extend the hips, pause at the top, and lower under control."),
    new(
      "Standing Calf Raise",
      MuscleGroup.Calves,
      "Calf isolation movement performed standing.",
      "Rise onto the balls of the feet, pause briefly, and lower through a full controlled range of motion."),
    new(
      "Plank",
      MuscleGroup.Core,
      "Isometric core exercise.",
      "Keep elbows under shoulders, maintain a straight line from head to heels, and brace without letting the hips sag."),
    new(
      "Dead Bug",
      MuscleGroup.Core,
      "Core stability exercise performed lying down.",
      "Press the low back gently toward the floor, extend opposite arm and leg, and return with control."),
    new(
      "Burpee",
      MuscleGroup.FullBody,
      "Full-body conditioning movement.",
      "Move from standing to plank, return the feet under the body, and jump or stand tall depending on the desired intensity."),
    new(
      "Running",
      MuscleGroup.Cardio,
      "Steady-state or interval cardio activity.",
      "Maintain a sustainable pace, keep relaxed shoulders, and adjust intensity according to the workout goal."),
    new(
      "Jump Rope",
      MuscleGroup.Cardio,
      "Cardio and coordination movement using a rope.",
      "Keep jumps low, rotate the rope from the wrists, and maintain a consistent rhythm.")
  ];
}
