
namespace JiraLite.Api.Dtos
{
    public record RegisterDto(string Email, string FullName, string Password);
    public record LoginDto(string Email, string Password);

    public record ProjectCreateDto(string Key, string Name, string? Description);
    public record IssueCreateDto(
        string Title, string? Description, string Status, string Priority,
        Guid? AssigneeId, Guid ProjectId, DateTime? DueDate);
    public record CommentCreateDto(Guid IssueId, string Body);
}
