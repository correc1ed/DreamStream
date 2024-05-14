namespace DreamStream.Controllers.Media.Models {
	public class SeriesViewModel {
		public required long Id { get; set; }
		public required string Title { get; set; }
		public required EpisodeViewModel[] Episodes { get; set; }
	}
}
