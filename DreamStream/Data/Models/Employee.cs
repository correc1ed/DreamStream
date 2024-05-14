using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamStream.Data.Models {
	public class Employee {
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }
		public required string FirstName { get; set; }
		public string? MiddleName { get; set; }
		public required string LastName { get; set; }
		public required DateTime Birthday { get; set; }
		public required EmployeeType Type { get; set; }
		public required decimal Salary { get; set; }
		public required string Education { get; set; }
	}
}
