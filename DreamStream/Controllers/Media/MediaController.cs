using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using DreamStream.Controllers.Media.Models;
using DreamStream.Data;
using DreamStream.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;

namespace DreamStream.Controllers.Media {
	[Route("api/media")]
	public class MediaController : DataControllerBase {
		private readonly ApplicationDbContext db;

		public MediaController(
			ApplicationDbContext applicationDb
		) {
			this.db = applicationDb;
		}

		[HttpGet("films")]
		[EnableQuery(PageSize = 100, MaxTop = 100)]
		public IQueryable<FilmViewModel> GetFilms()
			=> db.Set<Film>().Select(x => new FilmViewModel {
				Id = x.Id,
				Title = x.Title,
				MediaId = x.File.Id,
			});

		[HttpGet("music")]
		[EnableQuery(PageSize = 100, MaxTop = 100)]
		public IQueryable<AudioViewModel> GetMusic()
			=> db.Set<Audio>().Select(x => new AudioViewModel {
				Id = x.Id,
				Title = x.Title,
				MediaId = x.File.Id,
			});

		[HttpGet("series")]
		[EnableQuery(PageSize = 100, MaxTop = 100)]
		public IQueryable<SeriesViewModel> GetSeries()
			=> db.Set<Series>().Select(x => new SeriesViewModel {
				Id = x.Id,
				Title = x.Title,
				Episodes = x.Episodes.Select(y => new EpisodeViewModel {
					Id = y.Id,
					Title = y.Title,
					MediaId = y.File.Id
				}).ToArray()
			});

		[HttpGet($"{{{nameof(id)}}}")]
		public async Task<FileStreamResult> Get(
			[FromRoute] int id
		) {
			var file = await db.Set<MediaFile>().FirstAsync(x => x.Id == id);
			var stream = new MemoryStream(file.Content);
			return new FileStreamResult(stream, file.ContentType) {
				FileDownloadName = file.Name
			};
		}

		[HttpPost("films")]
		public async Task<long> CreateFilm(
			[FromForm, Required] CreateMediaModel model
		) {
			var fileContent = new byte[model.File.Length];
			using (var stream = model.File.OpenReadStream()) {
				await stream.ReadAsync(fileContent, HttpContext.RequestAborted);
			}
			var entity = new Film {
				Title = model.Title,
				File = new MediaFile {
					Name = model.File.Name,
					Content = fileContent,
					ContentType = model.File.ContentType
				}
			};
			db.Add(entity);
			await db.SaveChangesAsync();
			return entity.Id;
		}

		[HttpPost("music")]
		public async Task<long> CreateMusic(
			[FromForm, Required] CreateMediaModel model
		) {
			var fileContent = new byte[model.File.Length];
			using (var stream = model.File.OpenReadStream()) {
				await stream.ReadAsync(fileContent, HttpContext.RequestAborted);
			}
			var entity = new Audio {
				Title = model.Title,
				File = new MediaFile {
					Name = model.File.Name,
					Content = fileContent,
					ContentType = model.File.ContentType
				}
			};
			db.Add(entity);
			await db.SaveChangesAsync();
			return entity.Id;
		}

		[HttpPost("series")]
		public async Task<long> CreateSeries(
			[FromForm, Required] CreateSeriesModel model
		) {
			var entity = new Series {
				Title = model.Title,
				Episodes = Array.Empty<SeriesEpisode>()
			};
			db.Add(entity);
			await db.SaveChangesAsync();
			return entity.Id;
		}

		[HttpPost($"series/{{{nameof(seriesId)}}}")]
		public async Task<long> CreateEpisode(
			[FromRoute] long seriesId,
			[FromForm, Required] CreateMediaModel model
		) {
			var fileContent = new byte[model.File.Length];
			using (var stream = model.File.OpenReadStream()) {
				await stream.ReadAsync(fileContent, HttpContext.RequestAborted);
			}
			var series = await db.Set<Series>().FirstAsync(x => x.Id == seriesId);
			var entity = new SeriesEpisode {
				Title = model.Title,
				File = new MediaFile {
					Name = model.File.Name,
					Content = fileContent,
					ContentType = model.File.ContentType
				}
			};
			series.Episodes ??= new List<SeriesEpisode>();
			series.Episodes.Add(entity);
			await db.SaveChangesAsync();
			return entity.Id;
		}

		[HttpDelete($"films/{{{nameof(id)}}}")]
		public async Task<bool> DeleteFilm(
			[FromRoute] long id
		) {
			return await db.Set<Film>().Where(x => x.Id == id).ExecuteDeleteAsync() > 0;
		}

		[HttpDelete($"music/{{{nameof(id)}}}")]
		public async Task<bool> DeleteMusic(
			[FromRoute] long id
		) {
			return await db.Set<Audio>().Where(x => x.Id == id).ExecuteDeleteAsync() > 0;
		}

		[HttpDelete($"series/{{{nameof(seriesId)}}}")]
		public async Task<bool> DeleteSeries(
			[FromRoute] long seriesId,
			[FromQuery] long? episodeId
		) {
			if (episodeId.HasValue) {
				return await db.Set<Series>().Where(x => x.Id == seriesId).SelectMany(x => x.Episodes).Where(x => x.Id == episodeId).ExecuteDeleteAsync() > 0;
			} else {
				using (var tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled)) {
					await db.Set<Series>().Where(x => x.Id == seriesId).SelectMany(x => x.Episodes).ExecuteDeleteAsync();
					var result = await db.Set<Series>().Where(x => x.Id == seriesId).ExecuteDeleteAsync() > 0;
					tx.Complete();
					return result;
				}
			}
		}
	}
}
