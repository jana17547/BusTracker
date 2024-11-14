using System;
using Newtonsoft.Json;

namespace Server.Models
{
  /// <summary>
  /// A C# representation of the location udt in the Astra database
  /// </summary>
  public class Location
  {
    public double Longitude { get; set; }
    public double Latitude { get; set; }
  }

}