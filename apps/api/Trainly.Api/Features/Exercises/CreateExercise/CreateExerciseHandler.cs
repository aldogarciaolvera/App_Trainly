using Trainly.Api.Common.Authentication;
using Trainly.Api.Database;
using Trainly.Api.Features.Models;

namespace Trainly.Api.Features.Exercises.CreateExercise;

public sealed class CreateExerciseHandler
{
  private readonly AppDbContext _db;
  private readonly IUserContext _userContext;

  public CreateExerciseHandler(AppDbContext db, IUserContext userContext)
  {
    _db = db;
    _userContext = userContext;
  }

  public async Task<ExerciseDetailsResponse> HandleAsync(ExerciseWriteRequest request, CancellationToken cancellationToken)
  {
    var exercise = new Exercise
    {
      UserId = _userContext.GetUserId(),
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
