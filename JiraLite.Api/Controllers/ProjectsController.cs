using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JiraLite.Api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult Health() => Ok(new { ok = true, controller = "Projects" });
    }

}
