using Microsoft.EntityFrameworkCore;
using Trainly.Api.Common.Authentication;
using Trainly.Api.Common.Exceptions;
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
    var userId = _userContext.GetUserId();
    var muscleGroup = request.MuscleGroup!.Value;
    var normalizedName = request.Name.Trim().ToLower();
    var alreadyExists = await _db.Exercises.AnyAsync(
      x => x.UserId == userId &&
           x.MuscleGroup == muscleGroup &&
           x.Name.ToLower() == normalizedName,
      cancellationToken);

    if (alreadyExists)
      throw new ConflictException("Ya existe un ejercicio personalizado con ese nombre y grupo muscular.");

    var exercise = new Exercise
    {
      UserId = userId,
      Name = request.Name.Trim(),
      MuscleGroup = muscleGroup,
      Description = request.Description.Trim(),
      Instructions = request.Instructions.Trim()
    };

    _db.Exercises.Add(exercise);
    await _db.SaveChangesAsync(cancellationToken);

    return exercise.ToDetails();
  }
}
