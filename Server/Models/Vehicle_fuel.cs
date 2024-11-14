using System;
using Cassandra;

namespace Server.Models
{
  public class VehicleFuel //VechicleFuel
  {
    public TimeUuid TourId { get; set; }
    public double Fuel { get; set; }
    public DateTimeOffset Reading_Time { get; set; }
    public string Unit { get; set; }
  }
}