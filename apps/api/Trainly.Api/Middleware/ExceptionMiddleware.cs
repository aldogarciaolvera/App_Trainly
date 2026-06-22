using System.Text.Json;
using Trainly.Api.Common.Exceptions;

namespace Trainly.Api.Middleware;

public sealed class ExceptionMiddleware
{
  private readonly RequestDelegate _next;
  private readonly ILogger<ExceptionMiddleware> _logger;

  public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
  {
    _next = next;
    _logger = logger;
  }

  public async Task InvokeAsync(HttpContext context)
  {
    try
    {
      await _next(context);
    }
    catch (InvalidOperationException ex)
    {
      _logger.LogWarning(ex, "A conflict occurred while processing the request.");

      context.Response.StatusCode = StatusCodes.Status409Conflict;
      context.Response.ContentType = "application/json";

      await context.Response.WriteAsync(
        JsonSerializer.Serialize(new
        {
          Message = ex.Message
        })
      );
    }
    catch (ConflictException ex)
    {
      _logger.LogWarning(ex, "A domain conflict occurred while processing the request.");

      context.Response.StatusCode = StatusCodes.Status409Conflict;

      await context.Response.WriteAsJsonAsync(new
      {
        Message = ex.Message
      });
    }
    catch (NotFoundException ex)
    {
      _logger.LogWarning(ex, "A requested resource was not found.");

      context.Response.StatusCode = StatusCodes.Status404NotFound;

      await context.Response.WriteAsJsonAsync(new
      {
        Message = ex.Message
      });
    }
    catch (ValidationException ex)
    {
      _logger.LogWarning(ex, "Request validation failed.");

      context.Response.StatusCode = StatusCodes.Status400BadRequest;

      await context.Response.WriteAsJsonAsync(new
      {
        Message = ex.Message
      });
    }
    catch (UnauthorizedAccessException ex)
    {
      _logger.LogWarning(ex, "An unauthorized request was rejected.");

      context.Response.StatusCode = StatusCodes.Status401Unauthorized;

      await context.Response.WriteAsJsonAsync(new
      {
        error = ex.Message
      });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "An unexpected error occurred while processing the request.");

      context.Response.StatusCode = StatusCodes.Status500InternalServerError;
      context.Response.ContentType = "application/json";

      await context.Response.WriteAsync(
        JsonSerializer.Serialize(new
        {
          Message = "An unexpected error occurred."
        })
      );
    }
  }
}
