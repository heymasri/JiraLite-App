namespace JiraLite.Api.Models
{
    public class Issue
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public string Status { get; set; } = "ToDo";     // ToDo | InProgress | Done
        public string Priority { get; set; } = "Medium"; // Low | Medium | High
        public Guid? AssigneeId { get; set; }
        public Guid ReporterId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }

    }
}
