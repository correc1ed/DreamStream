using System;
using Microsoft.AspNetCore.Identity;

namespace DreamStream.Data.Models {
	public class User : IdentityUser<long> {
		public required DateTime Birthday { get; set; }
		public Employee? EmployeeData { get; set; }
	}
}
