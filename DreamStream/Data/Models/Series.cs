using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamStream.Data.Models {
	public class Series {
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }
		public required string Title { get; set; }
		public required ICollection<SeriesEpisode> Episodes { get; set; }
	}
}
