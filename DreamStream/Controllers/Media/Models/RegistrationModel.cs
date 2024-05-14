using System;
using System.ComponentModel.DataAnnotations;

namespace DreamStream.Controllers.Media.Models {
	public class RegistrationModel {
		[Required]
		public required string Username { get; set; }
		[Required]
		public required string Password { get; set; }
		[Required]
		public required DateTime Birthday { get; set; }
	}
}
