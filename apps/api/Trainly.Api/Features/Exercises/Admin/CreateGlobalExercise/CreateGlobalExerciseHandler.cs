using Trainly.Api.Database;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Exercises.Admin.CreateGlobalExercise;

public sealed class CreateGlobalExerciseHandler
{
  private readonly AppDbContext _db;

  public CreateGlobalExerciseHandler(AppDbContext db)
  {
    _db = db;
  }

  public async Task<ExerciseDetailsResponse> HandleAsync(ExerciseWriteRequest request, CancellationToken cancellationToken)
  {
    var exercise = new Exercise
    {
      UserId = null,
      Name = request.Name,
      MuscleGroup = request.MuscleGroup!.Value,
      Description = request.Description,
      Instructions = request.Instructions
    };

    _db.Exercises.Add(exercise);
    await _db.SaveChangesAsync(cancellationToken);

    return exercise.ToDetails();
  }
}
