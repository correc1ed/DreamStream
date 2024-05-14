using System;

namespace DreamStream.Controllers.Users.Models {
	public class UserViewModel {
		public required long Id { get; set; }

		public required string Username { get; set; }

		public required DateTime BirthDay { get; set; }

		public required bool IsEmployee { get; set; }
	}
}
