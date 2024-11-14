using Cassandra;
using System;

namespace Server.Models
{
  public class VehicleLocation
  {
    public TimeUuid TourId { get; set; }
    public Location Location { get; set; }
    public DateTimeOffset Reading_time { get; set; }
    public int Distance { get; set; }
  }
}