using System.ComponentModel.DataAnnotations;

namespace DreamStream.Controllers.Media.Models {
	public class FilmViewModel {
		[Key]
		public required long Id { get; set; }
		public required long MediaId { get; set; }
		public required string Title { get; set; }
	}
}
