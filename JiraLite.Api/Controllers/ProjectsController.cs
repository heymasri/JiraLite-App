
using JiraLite.Api.Data;
using JiraLite.Api.Dtos;
using JiraLite.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JiraLite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Base path for all endpoints
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]  // All actions in this controller require a valid JWT (user must be logged in)

    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _db;
        // The DbContext is injected by ASP.NET (we registered it in Program.cs)
        public ProjectsController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/projects
        // returns all projects, newest first 
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _db.Projects
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync(); // Executes SQL and returns a List<Project>


            return Ok(projects); // 200 ok + Json array
        }

        // POST /api/projects
        //creates a project
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProjectCreateDto dto)
        {
            // Read the user id from the token (the subject claim in login)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token");

            var project = new Project
            {
                Key = dto.Key,
                Name = dto.Name,
                Description = dto.Description,
                OwnerId = Guid.Parse(userId),
                CreatedAt = DateTime.UtcNow
            };
            // Stage an INSERT and then save to DB
            _db.Projects.Add(project);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), project);
        }

        // PUT /api/projects/{id}
        // Updates an existing project
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProjectCreateDto dto)
        {
            // fetch project from DB with primary key
            var project = await _db.Projects.FindAsync(id);
            if (project is null)
                return NotFound(); // 404 project not found

            // get logged-in user ID from JWT
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(); // 401 if token is invalid

            // owner check for security
            if (project.OwnerId != Guid.Parse(userId))
                return Forbid(); // 403 if not project owner

            // update fields
            project.Key = dto.Key;
            project.Name = dto.Name;
            project.Description = dto.Description;

            // Save changes - EF generates update sql
            await _db.SaveChangesAsync();

            // 204 No Content = successful update, no body
            return NoContent();
        }

        // DELETE /api/projects/{id}
        // Deletes a project (only owner can delete)
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            // Load the project by ID
            var project = await _db.Projects.FindAsync(id);
            if (project is null)
                return NotFound(); // 404 if project id not found

            // Get current user ID from JWT(sub claim)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(); // 401 if token is invalid

            // Owner check
            if (project.OwnerId != Guid.Parse(userId))
                return Forbid(); // 403 user authenticated but not allowed.

            // Remove project from DB (EF)
            _db.Projects.Remove(project);
            await _db.SaveChangesAsync();

            // Return 204 No Content
            return NoContent();
        }

    }
}
