namespace JiraLite.Api.Models
{
    public class Comment
    {
        public Guid Id { get; set; }
        public Guid IssueId { get; set; }
        public Guid AuthorId { get; set; }
        public string Body { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
