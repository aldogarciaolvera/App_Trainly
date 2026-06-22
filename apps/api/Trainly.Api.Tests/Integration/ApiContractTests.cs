using System.Net;
using System.Net.Http.Json;
using Trainly.Api.Features.Models;
using Trainly.Api.Features.Users.GetUserById;
using Trainly.Api.Features.Workouts.CreateWorkout;
using Trainly.Api.Features.Workouts.GetWorkouts;
using Trainly.Api.Features.Workouts.UpdateWorkout;

namespace Trainly.Api.Tests.Integration;

public sealed class ApiContractTests : IClassFixture<TrainlyApiFactory>
{
  private readonly TrainlyApiFactory _factory;

  public ApiContractTests(TrainlyApiFactory factory)
  {
    _factory = factory;
  }

  [Fact]
  public async Task Protected_endpoint_returns_401_without_authentication()
  {
    await _factory.ResetDatabaseAsync();
    using var client = _factory.CreateAnonymousClient();

    var response = await client.GetAsync("/api/workouts");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task Admin_endpoint_returns_403_for_normal_user()
  {
    await _factory.ResetDatabaseAsync();
    using var client = _factory.CreateAuthenticatedClient(Guid.NewGuid());

    var response = await client.GetAsync("/api/users");

    Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
  }

  [Fact]
  public async Task Invalid_workout_returns_400_from_automatic_validation()
  {
    await _factory.ResetDatabaseAsync();
    using var client = _factory.CreateAuthenticatedClient(Guid.NewGuid());

    var response = await client.PostAsJsonAsync("/api/workouts", new
    {
      name = string.Empty,
      description = "Invalid workout"
    });

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Current_user_endpoint_returns_profile_from_identity()
  {
    await _factory.ResetDatabaseAsync();
    var user = CreateUser("ana@trainly.test");
    await _factory.SeedAsync(user);
    using var client = _factory.CreateAuthenticatedClient(user.Id);

    var response = await client.GetAsync("/api/users/me");
    var profile = await response.Content.ReadFromJsonAsync<GetUserByIDResponse>();

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    Assert.NotNull(profile);
    Assert.Equal(user.Id, profile.Id);
    Assert.Equal(user.Email, profile.Email);
  }

  [Fact]
  public async Task Workout_crud_flow_respects_routes_pagination_and_status_codes()
  {
    await _factory.ResetDatabaseAsync();
    var user = CreateUser("ana@trainly.test");
    await _factory.SeedAsync(user);
    using var client = _factory.CreateAuthenticatedClient(user.Id);

    var alphaResponse = await client.PostAsJsonAsync("/api/workouts", new
    {
      name = "Alpha",
      description = "First"
    });
    var betaResponse = await client.PostAsJsonAsync("/api/workouts", new
    {
      name = "Beta",
      description = "Second"
    });
    var beta = await betaResponse.Content.ReadFromJsonAsync<CreateWResponse>();

    Assert.Equal(HttpStatusCode.Created, alphaResponse.StatusCode);
    Assert.Equal(HttpStatusCode.Created, betaResponse.StatusCode);
    Assert.NotNull(beta);

    var page = await client.GetFromJsonAsync<GetWorkoutsResponse>(
      "/api/workouts?page=2&pageSize=1");

    Assert.NotNull(page);
    Assert.Equal(2, page.Total);
    Assert.Equal(2, page.Page);
    Assert.Equal("Beta", Assert.Single(page.Items).Name);

    var updateResponse = await client.PutAsJsonAsync($"/api/workouts/{beta.Id}", new
    {
      name = "Beta updated",
      description = "Updated"
    });
    var updated = await updateResponse.Content.ReadFromJsonAsync<UpdateWResponse>();

    Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
    Assert.NotNull(updated);
    Assert.Equal("Beta updated", updated.Name);

    var deleteResponse = await client.DeleteAsync($"/api/workouts/{beta.Id}");
    var getDeletedResponse = await client.GetAsync($"/api/workouts/{beta.Id}");

    Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    Assert.Equal(HttpStatusCode.NotFound, getDeletedResponse.StatusCode);
  }

  private static User CreateUser(string email)
  {
    return new User
    {
      Id = Guid.NewGuid(),
      Name = "Ana",
      Email = email,
      PasswordHash = "not-used-in-this-test"
    };
  }
}
