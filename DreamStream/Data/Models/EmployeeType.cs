using System.Text.Json.Serialization;

namespace DreamStream.Data.Models {
	[JsonConverter(typeof(JsonStringEnumConverter))]
	public enum EmployeeType {
		GeneralDirector = 1,
		DeputyDirector,
		AdvertisingManager,
		Accountant,
		Lawyer1,
		Lawyer2,
		Programmer,
		AssistantProgrammer
	}
}