using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace DreamStream.Controllers.Media.Models {
	public class CreateMediaModel {
		[Required]
		public required string Title { get; set; }
		[Required]
		public required IFormFile File { get; set; }
	}
}
