using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JiraLite.Api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class IssuesController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult Health() => Ok(new { ok = true, controller = "Issues" });
    }

}
