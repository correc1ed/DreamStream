using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using DreamStream.Controllers.Users.Models;
using DreamStream.Data;
using DreamStream.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DreamStream.Controllers.Users {
	[Route("api/employees")]
	public class EmployeeController : ApiControllerBase {
		private readonly ApplicationDbContext db;

		public EmployeeController(
			ApplicationDbContext applicationDb
		) {
			this.db = applicationDb;
		}

		[HttpGet]
		public Task<Employee[]> GetAll()
			=> db.Set<Employee>().ToArrayAsync();

		[HttpPost]
		public async Task Add(
			[FromBody, Required] CreateEmployeeModel model
		) {
			var person = new Employee {
				Education = model.Education,
				Birthday = model.BirthDay,
				LastName = model.LastName,
				MiddleName = model.MiddleName,
				FirstName = model.FirstName,
				Type = model.Type,
				Salary = model.Salary
			};

			db.Set<Employee>().Add(person);
			await db.SaveChangesAsync();
		}
	}
}
