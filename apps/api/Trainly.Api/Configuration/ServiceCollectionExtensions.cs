using Trainly.Api.Common.Security;
using Trainly.Api.Common.Authentication;

namespace Trainly.Api.Configuration;

public static class ServiceCollectionExtensions
{
  public static IServiceCollection AddApplicationServices(this IServiceCollection services)
  {
    services.AddHttpContextAccessor();

    services.AddScoped<IUserContext, UserContext>();
    services.AddScoped<IPasswordHasher, PasswordHasher>();
    services.AddScoped<ITokenService, JwtTokenService>();
    services.AddScoped<IRefreshTokenGenerator, RefreshTokenGenerator>();
    services.AddScoped<Features.Auth.Register.RegisterHandler>();
    services.AddScoped<Features.Auth.Login.LoginHandler>();
    services.AddScoped<Features.Auth.RefreshToken.RTHandler>();
    services.AddScoped<Features.Auth.Logout.LogoutHandler>();
    services.AddScoped<Features.Users.GetUserById.GetUserByIdHandler>();
    services.AddScoped<Features.Users.GetUsers.GetUsersHandler>();
    services.AddScoped<Features.Users.GetCurrentUser.GetCurrentUserHandler>();
    services.AddScoped<Features.Workouts.CreateWorkout.CreateWHandler>();
    services.AddScoped<Features.Workouts.GetWorkouts.GetWorkoutsHandler>();
    services.AddScoped<Features.Workouts.GetWorkoutById.GetWorkoutByIdHandler>();
    services.AddScoped<Features.Workouts.UpdateWorkout.UpdateWHandler>();
    services.AddScoped<Features.Workouts.DeleteWorkout.DeleteWHandler>();

    return services;
  }
}
