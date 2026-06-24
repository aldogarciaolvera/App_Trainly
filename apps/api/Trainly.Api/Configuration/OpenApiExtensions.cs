using Scalar.AspNetCore;

namespace Trainly.Api.Configuration;

public static class OpenApiExtensions
{
  public static IServiceCollection AddOpenApiDocumentation(this IServiceCollection services)
  {
    services.AddOpenApi();

    return services;
  }

  public static WebApplication UseOpenApiDocumentation(this WebApplication app)
  {
    app.MapOpenApi();
    app.MapScalarApiReference("/", options =>
    {
      options.WithTitle("Trainly API");
      options.Layout = ScalarLayout.Modern;
      options.DarkMode = true;
      options.ShowSidebar = true;
      options.PersistentAuthentication = true;
      options.DocumentDownloadType = DocumentDownloadType.None;
      options.HideModels = true;
      options.HideSearch = true;
      options.HideClientButton = true;
      options.ShowDeveloperTools = DeveloperToolsVisibility.Never;
      options.DisableMcp();
      options.ExpandAllResponses();
    });

    return app;
  }
}
