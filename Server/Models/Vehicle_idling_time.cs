using System;
using Newtonsoft.Json;
using Cassandra;

namespace Server.Models
{
  public class VehicleIdlingTime
  {
    public TimeUuid TourId { get; set; }
    public double Time_Idle { get; set; }
    public DateTimeOffset Reading_Time { get; set; }
    public string Unit { get; set; }
  }

}