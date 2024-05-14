using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace DreamStream.Controllers {
	[Authorize]
	public class DataControllerBase : ODataController {
	}
}
