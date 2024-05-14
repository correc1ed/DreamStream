using DreamStream.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DreamStream.Data {
	public class ApplicationDbContext : DbContext {
		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			base.OnModelCreating(modelBuilder);
			modelBuilder.Entity<User>();
			modelBuilder.Entity<Employee>();
			modelBuilder.Entity<Film>();
			modelBuilder.Entity<Audio>();
			modelBuilder.Entity<Series>();
			modelBuilder.Entity<SeriesEpisode>();
			modelBuilder.Entity<MediaFile>();
			modelBuilder.Entity<IdentityUserClaim<long>>();
		}

		public ApplicationDbContext(
			DbContextOptions options
		) : base(options) {
		}
	}
}
