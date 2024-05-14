using System;
using DreamStream.Data.Models;

namespace DreamStream.Controllers.Users.Models {
	public class CreateEmployeeModel {
		public required string FirstName { get; set; }

		public string? MiddleName { get; set; }

		public required string LastName { get; set; }

		public required DateTime BirthDay { get; set; }

		public required EmployeeType Type { get; set; }

		public required decimal Salary { get; set; }

		public required string Education { get; set; }
	}
}
