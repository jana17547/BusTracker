using System;
using Cassandra;

namespace Server.Models
{
  public class VehicleSpeed
  {
    public Cassandra.TimeUuid TourId { get; set; }
    public int Speed { get; set; }
    public DateTimeOffset Reading_time { get; set; }
    public string Unit { get; set; }
  }
}