
namespace JiraLite.Api.Dtos
{
    //the incomming payload for both create and update operations.
    public record RegisterDto(string Email, string FullName, string Password);
    public record LoginDto(string Email, string Password);

    //unique code of the project, friendly name, descrption
    public record ProjectCreateDto(string Key, string Name, string? Description);
    public record IssueCreateDto(
        string Title, string? Description, string Status, string Priority,
        Guid? AssigneeId, Guid ProjectId, DateTime? DueDate);
    public record CommentCreateDto(Guid IssueId, string Body);
}
