using System.ComponentModel.DataAnnotations.Schema;

namespace DreamStream.Data.Models {
	public class SeriesEpisode {
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }
		public required string Title { get; set; }
		public required MediaFile File { get; set; }
	}
}
