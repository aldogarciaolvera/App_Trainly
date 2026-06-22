using Trainly.Api.Common.Security;

namespace Trainly.Api.Tests.TestInfrastructure;

internal sealed class StubPasswordHasher : IPasswordHasher
{
  public string Hash(string password) => $"hashed:{password}";

  public bool Verify(string password, string hash) => Hash(password) == hash;
}
