using Trainly.Api.Database;
using Trainly.Api.Features.Users.Models;

namespace Trainly.Api.Features.Users.CreateUser;

public sealed class Handler
{
    private readonly AppDbContext _db;

    public Handler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Response> HandleAsync(
        Request request,
        CancellationToken cancellationToken)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,

            // Temporal
            PasswordHash = request.Password,

            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);

        await _db.SaveChangesAsync(cancellationToken);

        return new Response
        {
            Id = user.Id
        };
    }
}