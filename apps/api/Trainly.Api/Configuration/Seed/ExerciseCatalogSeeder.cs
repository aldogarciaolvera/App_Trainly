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
    var existingExercises = await _db.Exercises
      .Where(x => x.UserId == null)
      .ToListAsync(cancellationToken);

    var now = DateTime.UtcNow;

    var added = 0;
    var updated = 0;

    foreach (var item in InitialCatalog)
    {
      var existing = existingExercises.FirstOrDefault(x =>
        x.MuscleGroup == item.MuscleGroup &&
        (string.Equals(x.Name, item.Name, StringComparison.OrdinalIgnoreCase) ||
         string.Equals(x.Name, item.LegacyName, StringComparison.OrdinalIgnoreCase)));

      if (existing is null)
      {
        _db.Exercises.Add(new Exercise
        {
          Id = Guid.NewGuid(),
          UserId = null,
          Name = item.Name,
          MuscleGroup = item.MuscleGroup,
          Description = item.Description,
          Instructions = item.Instructions,
          CreatedAt = now,
          UpdatedAt = now
        });
        added++;
        continue;
      }

      if (existing.Name == item.Name &&
          existing.Description == item.Description &&
          existing.Instructions == item.Instructions)
      {
        continue;
      }

      existing.Name = item.Name;
      existing.Description = item.Description;
      existing.Instructions = item.Instructions;
      existing.UpdatedAt = now;
      updated++;
    }

    if (added == 0 && updated == 0)
    {
      _logger.LogInformation("Seed del catálogo global de ejercicios omitido. No se encontraron cambios pendientes.");
      return;
    }

    await _db.SaveChangesAsync(cancellationToken);

    _logger.LogInformation(
      "Seed del catálogo global de ejercicios aplicado. Agregados: {Added}. Actualizados: {Updated}.",
      added,
      updated);
  }

  private sealed record ExerciseCatalogItem(
    string LegacyName,
    string Name,
    MuscleGroup MuscleGroup,
    string Description,
    string Instructions);

  private static readonly ExerciseCatalogItem[] InitialCatalog =
  [
    new(
      "Bench Press",
      "Press banca",
      MuscleGroup.Chest,
      "Press compuesto de pecho realizado con barra.",
      "Acuéstate en el banco, mantén los pies firmes, baja la barra con control hacia el pecho y empuja hacia arriba sin perder estabilidad en los hombros."),
    new(
      "Incline Dumbbell Press",
      "Press inclinado con mancuernas",
      MuscleGroup.Chest,
      "Press para pecho superior usando mancuernas en banco inclinado.",
      "Coloca el banco en una inclinación moderada, baja las mancuernas cerca del pecho superior y empuja manteniendo las muñecas alineadas."),
    new(
      "Push-Up",
      "Flexión",
      MuscleGroup.Chest,
      "Empuje horizontal con peso corporal para pecho, hombros, tríceps y core.",
      "Mantén el cuerpo en línea recta, baja hasta acercar el pecho al suelo y empuja de nuevo mientras mantienes el core firme."),
    new(
      "Pull-Up",
      "Dominada",
      MuscleGroup.Back,
      "Movimiento de jalón vertical usando el peso corporal.",
      "Cuélgate de la barra, lleva el pecho hacia arriba, controla los hombros y desciende con control."),
    new(
      "Barbell Row",
      "Remo con barra",
      MuscleGroup.Back,
      "Movimiento de jalón horizontal para la espalda.",
      "Haz bisagra de cadera, mantén la espalda neutra, jala la barra hacia el torso y bájala con control."),
    new(
      "Lat Pulldown",
      "Jalón al pecho",
      MuscleGroup.Back,
      "Jalón vertical en máquina para dorsales y espalda alta.",
      "Toma la barra, jálala hacia la parte alta del pecho, mantén el torso estable y regresa lentamente."),
    new(
      "Shoulder Press",
      "Press de hombro",
      MuscleGroup.Shoulders,
      "Press vertical para hombros y tríceps.",
      "Aprieta el core, empuja el peso por encima de la cabeza, evita arquear demasiado la espalda baja y baja con control."),
    new(
      "Lateral Raise",
      "Elevación lateral",
      MuscleGroup.Shoulders,
      "Movimiento de aislamiento para el deltoide lateral.",
      "Eleva las mancuernas hasta la altura de los hombros con ligera flexión de codo, pausa brevemente y baja con control."),
    new(
      "Biceps Curl",
      "Curl de bíceps",
      MuscleGroup.Biceps,
      "Movimiento de aislamiento para bíceps.",
      "Mantén los codos cerca del torso, sube el peso sin balancearte, contrae arriba y baja lentamente."),
    new(
      "Triceps Pushdown",
      "Extensión de tríceps en polea",
      MuscleGroup.Triceps,
      "Movimiento de aislamiento en polea para tríceps.",
      "Mantén los codos pegados al cuerpo, extiende completamente los brazos y regresa sin adelantar los hombros."),
    new(
      "Back Squat",
      "Sentadilla trasera",
      MuscleGroup.Quadriceps,
      "Sentadilla compuesta de tren inferior realizada con barra.",
      "Aprieta el core, baja con control, deja que las rodillas sigan la línea de los pies y sube empujando desde el medio del pie."),
    new(
      "Leg Press",
      "Prensa de pierna",
      MuscleGroup.Quadriceps,
      "Empuje de tren inferior realizado en máquina.",
      "Coloca los pies firmes en la plataforma, baja el trineo con control y empuja sin bloquear agresivamente las rodillas."),
    new(
      "Romanian Deadlift",
      "Peso muerto rumano",
      MuscleGroup.Hamstrings,
      "Movimiento de bisagra de cadera enfocado en isquiotibiales y glúteos.",
      "Mantén una ligera flexión de rodillas, lleva la cadera hacia atrás, baja el peso cerca de las piernas y vuelve a subir extendiendo la cadera."),
    new(
      "Hip Thrust",
      "Hip thrust",
      MuscleGroup.Glutes,
      "Movimiento de extensión de cadera enfocado en glúteos.",
      "Apoya la espalda alta en un banco, empuja desde los talones, extiende la cadera, pausa arriba y baja con control."),
    new(
      "Standing Calf Raise",
      "Elevación de pantorrilla de pie",
      MuscleGroup.Calves,
      "Movimiento de aislamiento para pantorrillas realizado de pie.",
      "Sube sobre la punta de los pies, pausa brevemente y baja usando un rango completo y controlado."),
    new(
      "Plank",
      "Plancha",
      MuscleGroup.Core,
      "Ejercicio isométrico para el core.",
      "Coloca los codos debajo de los hombros, mantén una línea recta de cabeza a talones y aprieta el core sin dejar caer la cadera."),
    new(
      "Dead Bug",
      "Dead bug",
      MuscleGroup.Core,
      "Ejercicio de estabilidad de core realizado en el suelo.",
      "Presiona suavemente la espalda baja contra el suelo, extiende brazo y pierna contrarios y regresa con control."),
    new(
      "Burpee",
      "Burpee",
      MuscleGroup.FullBody,
      "Movimiento de acondicionamiento de cuerpo completo.",
      "Pasa de pie a posición de plancha, regresa los pies debajo del cuerpo y salta o ponte de pie según la intensidad deseada."),
    new(
      "Running",
      "Correr",
      MuscleGroup.Cardio,
      "Actividad cardiovascular continua o por intervalos.",
      "Mantén un ritmo sostenible, relaja los hombros y ajusta la intensidad según el objetivo del entrenamiento."),
    new(
      "Jump Rope",
      "Saltar la cuerda",
      MuscleGroup.Cardio,
      "Movimiento de cardio y coordinación usando cuerda.",
      "Mantén saltos bajos, gira la cuerda desde las muñecas y conserva un ritmo constante.")
  ];
}
