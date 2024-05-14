using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using DreamStream.Controllers.Media.Models;
using DreamStream.Controllers.Users.Models;
using DreamStream.Data;
using DreamStream.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DreamStream.Controllers.Users {
	[Route("api/auth")]
	public class AuthController : ApiControllerBase {
		private readonly ApplicationDbContext db;
		private readonly UserManager<User> userManager;
		private readonly SignInManager<User> signInManager;

		public AuthController(
			ApplicationDbContext db,
			UserManager<User> userManager,
			SignInManager<User> signInManager
		) {
			this.db = db;
			this.userManager = userManager;
			this.signInManager = signInManager;
		}

		[HttpPut]
		[AllowAnonymous]
		public async Task<UserViewModel?> Register(
			[FromBody] RegistrationModel model
		) {
			var user = new User {
				UserName = model.Username,
				Birthday = model.Birthday
			};
			var result = await userManager.CreateAsync(user, model.Password);
			if (result.Succeeded) {
				await signInManager.SignInAsync(user, true);
				return GetUserModel(await userManager.FindByNameAsync(user.UserName))!;
			} else {
				Response.StatusCode = 401;
				return null;
			}
		}

		[HttpPost]
		[AllowAnonymous]
		public async Task<UserViewModel?> SignIn(
			[FromQuery] string username,
			[FromQuery] string password
		) {
			var result = await signInManager.PasswordSignInAsync(username, password, true, false);
			if (result.Succeeded) {
				return GetUserModel(await userManager.FindByNameAsync(username))!;
			} else {
				Response.StatusCode = 401;
				return null;
			}
		}

		[HttpGet]
		public async Task<UserViewModel> GetCurrentUser() {
			var result = GetUserModel(await userManager.GetUserAsync(User))!;
			if (result == null) {
				Response.StatusCode = 401;
			}
			return result;
		}

		[HttpDelete]
		public Task Logout()
			=> signInManager.SignOutAsync();

		[return: NotNullIfNotNull(nameof(User))]
		private UserViewModel? GetUserModel(User? user) {
			if (user == null) { return null; }
			return new UserViewModel {
				Id = user.Id,
				Username = user.UserName!,
				BirthDay = user.Birthday,
				IsEmployee = this.db.Set<User>().Any(x => x == user && x.EmployeeData != null)
			};
		}
	}
}
