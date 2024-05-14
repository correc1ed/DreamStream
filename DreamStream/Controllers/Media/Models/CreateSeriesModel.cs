using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace DreamStream.Controllers.Media.Models {
	public class CreateSeriesModel {
		[Required]
		public required string Title { get; set; }
	}
}
