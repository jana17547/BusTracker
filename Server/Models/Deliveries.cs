using System;

namespace Server.Models
{
  public class Tour
  {
    public int Bus_Id { get; set; }
    public Cassandra.TimeUuid TourId { get; set; }
    public string Driver { get; set; }
    public string Start_Address { get; set; }
    public string End_Address { get; set; }
    public int Year { get; set; }
    public DateTimeOffset Departing_Time { get; set; }
    public DateTimeOffset Arrival_Time { get; set; }
    public string Tour_Description { get; set; }
    public bool Active { get; set; }
  }

}