using System.ComponentModel.DataAnnotations.Schema;

namespace DreamStream.Data.Models {
	public class MediaFile {
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }
		public required string Name { get; set; }
		public required string ContentType { get; set; }
		public required byte[] Content { get; set; }
	}
}
