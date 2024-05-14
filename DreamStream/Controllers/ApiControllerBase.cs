using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DreamStream.Controllers {
	[Authorize]
	[ApiController]
	public class ApiControllerBase : ControllerBase {
	}
}
