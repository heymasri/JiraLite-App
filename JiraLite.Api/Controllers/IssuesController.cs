
using JiraLite.Api.Data;                          // AppDbContext for database
using JiraLite.Api.Dtos;                          // IssueCreateDto
using JiraLite.Api.Models;                        // Issue entity
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;                     // ClaimTypes.NameIdentifier

namespace JiraLite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/issues
    //this controller uses JWT Bearer auth
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class IssuesController : ControllerBase
    {
        private readonly AppDbContext _db;

        // Constructor: ASP.NET injects AppDbContext automatically
        public IssuesController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/issues/health
        // Simple endpoint to confirm controller is reachable
        [HttpGet("health")]
        [AllowAnonymous] // anyone can call health
        public IActionResult Health() => Ok(new { ok = true, controller = "Issues" });

        // POST /api/issues
        // creates a new issue (ticket/task) under a project
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IssueCreateDto dto)
        {
            // 1) Read logged-in user id from JWT
            // In ASP.NET Core, JWT "sub" is mapped to ClaimTypes.NameIdentifier
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // If userId is missing, token was missing/invalid -> 401
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User id missing from token");

            // 2) Very simple validations (we keep it beginner-friendly)
            var allowedStatus = new[] { "ToDo", "InProgress", "Done" };
            var allowedPriority = new[] { "Low", "Medium", "High" };

            if (!allowedStatus.Contains(dto.Status))
                return BadRequest(new { message = "Status must be ToDo, InProgress, or Done" });

            if (!allowedPriority.Contains(dto.Priority))
                return BadRequest(new { message = "Priority must be Low, Medium, or High" });

            // 3) Create Issue entity (this becomes a row in the Issues table)
            var issue = new Issue
            {
                ProjectId = dto.ProjectId,  // which project it belongs to
                Title = dto.Title,  // summary
                Description = dto.Description,  // details
                Status = dto.Status,    // ToDo/InProgress/Done
                Priority = dto.Priority,    // Low/Medium/High
                AssigneeId = dto.AssigneeId,// optional
                ReporterId = Guid.Parse(userId),        // logged-in user is the reporter
                DueDate = dto.DueDate,    // optional
                CreatedAt = DateTime.UtcNow, // timestamps set on server
                UpdatedAt = DateTime.UtcNow
            };

            // 4) Save issue into DB
            _db.Issues.Add(issue);
            await _db.SaveChangesAsync();

            // 5) Return the created issue as JSON
            return Ok(issue);
        }

        // GET /api/issues/by-project/{projectId}
        // Returns issues for a project, grouped by Status (ToDo / InProgress / Done)
        [HttpGet("by-project/{projectId:guid}")]
        public async Task<IActionResult> GetByProject(Guid projectId)
        {
            // 1) Get all issues for the given project
            var issues = await _db.Issues
                .Where(i => i.ProjectId == projectId)
                .OrderByDescending(i => i.UpdatedAt)
                .ToListAsync();

            // 2) Group them by status
            var grouped = issues
                .GroupBy(i => i.Status)
                .ToDictionary(
                    g => g.Key,
                    g => g.ToList()
                );

            // 3) Ensure all statuses exist (even if empty)
            var allStatuses = new[] { "ToDo", "InProgress", "Done" };

            foreach (var status in allStatuses)
            {
                if (!grouped.ContainsKey(status))
                    grouped[status] = new List<Issue>();
            }

            // 4) Return grouped result
            return Ok(grouped);
        }

        // PATCH /api/issues/{id}/status/{status}
        // Changes the status of an issue (ToDo/InProgress/Done)
        [HttpPatch("{id:guid}/status/{status}")]
        public async Task<IActionResult> ChangeStatus(Guid id, string status)
        {
            // 1) Validate status
            var allowedStatus = new[] { "ToDo", "InProgress", "Done" };
            if (!allowedStatus.Contains(status))
                return BadRequest(new { message = "Invalid status value" });

            // 2) Find the issue by id
            var issue = await _db.Issues.FindAsync(id);
            if (issue is null)
                return NotFound();

            // 3) Update status + timestamp
            issue.Status = status;
            issue.UpdatedAt = DateTime.UtcNow;

            // 4) Save changes
            await _db.SaveChangesAsync();

            // 5) Return updated issue
            return Ok(issue);
        }

    }
}
