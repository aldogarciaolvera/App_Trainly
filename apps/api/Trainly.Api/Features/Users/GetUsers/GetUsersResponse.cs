namespace Trainly.Api.Features.Users.GetUsers;

public sealed class GetUsersResponse
{
  public List<GetUsersUserItem> Items { get; set; } = [];
  public int Total { get; set; }
  public int Page { get; set; }
  public int PageSize { get; set; }
}