namespace JiraLite.Api.Models
{
    public class Project
    {
        public Guid Id { get; set; }
        public string Key { get; set; } = "";
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public Guid OwnerId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
