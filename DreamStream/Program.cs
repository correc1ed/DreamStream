using System.Threading.Tasks;
using DreamStream.Controllers.Media.Models;
using DreamStream.Data;
using DreamStream.Data.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

namespace DreamStream {
	public class Program {
		public static async Task Main(string[] args) {
			var host = CreateHost(args);
			await using (var scope = host.Services.CreateAsyncScope()) {
				var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
				await db.Database.MigrateAsync();
			}
			await host.RunAsync();
		}

		internal static IHost CreateHost(string[] args) {
			var builder = WebApplication.CreateBuilder(args);
			LoadConfiguration(builder.Configuration, builder.Environment);
			MapConfiguration(builder.Services, builder.Configuration);
			RegisterServices(builder.Services, builder.Configuration, builder.Environment);
			var host = builder.Build();
			Configure(host, builder.Configuration, builder.Environment);
			return host;
		}

		private static void LoadConfiguration(IConfigurationBuilder builder, IWebHostEnvironment env) {
			builder.AddJsonFile("appsettings.json", false, true)
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", true, true);
		}

		private static void MapConfiguration(IServiceCollection services, IConfiguration config) {
		}

		private static void RegisterServices(IServiceCollection services, IConfiguration config, IWebHostEnvironment env) {
			services.AddControllersWithViews()
				.AddApplicationPart(typeof(Program).Assembly)
				.AddOData(options => {
					options.EnableQueryFeatures();
					options.AddRouteComponents("api/media", GetEdmModel());
				});
			services.AddIdentityCore<User>(options => {
				options.Password = new PasswordOptions {
					RequireNonAlphanumeric = false,
					RequireDigit = false,
					RequiredLength = 2,
					RequiredUniqueChars = 2,
					RequireLowercase = false,
					RequireUppercase = false
				};
			}).AddEntityFrameworkStores<ApplicationDbContext>()
				.AddSignInManager();
			services.AddAuthentication(IdentityConstants.ApplicationScheme)
				.AddIdentityCookies();
			services.AddAuthorization();
			services.AddSwaggerGen();
			services.AddDbContext<ApplicationDbContext>(c => {
				c.UseSqlServer(config.GetConnectionString("ApplicationDb"));
			});
		}

		private static void Configure(IApplicationBuilder app, IConfiguration config, IWebHostEnvironment env) {
			if (env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();
				app.UseSwagger();
				app.UseSwaggerUI();
			} else {
				app.UseExceptionHandler();
				app.UseHsts();
			}
			app.UseHttpsRedirection();
			app.UseStaticFiles();

			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();

			app.UseEndpoints(endpoints => {
				endpoints.MapControllers();
				endpoints.MapFallbackToFile("index.html");
			});
		}

		private static IEdmModel GetEdmModel() {
			var builder = new ODataConventionModelBuilder();
			builder.EntitySet<FilmViewModel>("films");
			builder.EntitySet<AudioViewModel>("music");
			builder.EntitySet<SeriesViewModel>("series");
			return builder.GetEdmModel();
		}
	}
}
