using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server;
using Server.Interfaces;
using Cassandra;
using Server.Models;
using System.Threading;

namespace Server.Services
{
  public class DataProvider
  {
    private ISession Session { get; set; }

    public DataProvider()
    {
      Session = new AstraService().Session;
      Session.UserDefinedTypes.DefineAsync(
          UdtMap.For<Location>(keyspace: "bus_tracker")
          .Map(l => l.Longitude, "longitude")
          .Map(l => l.Latitude, "latitude")).ConfigureAwait(false);
    }

    #region Tours

    public RowSet getTours(string tourDescription, int year)
    {
      return Session.Execute($"SELECT * FROM bus_tracker.tour WHERE tour_description = '{tourDescription}' and year = {year}");
    }

    public void DeleteTour(string tour_description, int year, Cassandra.TimeUuid tourId, DateTimeOffset departingTime)
    {
      Session.Execute($"delete from bus_tracker.vechiclefuel  where  tourId = {tourId}  if exists");
      Session.Execute($"delete from bus_tracker.vechiclelocation where  tourId = {tourId}  if exists");
      Session.Execute($"delete from bus_tracker.vechicleidlingtime where  tourId = {tourId}  if exists");
      Session.Execute($"delete from bus_tracker.vechiclespeed where  tourId = {tourId}  if exists");
      Session.Execute($"delete from bus_tracker.tour where tour_description = '{tour_description}' and year = {year} and tourId = {tourId} and departing_time = '{departingTime.ToUnixTimeMilliseconds()}' if exists");
    }

    public void CreateTour(Tour d)
    {
      Tour tour = new Tour
      {
        Active = d.Active,
        Tour_Description = d.Tour_Description,
        TourId = d.TourId,
        Departing_Time = d.Departing_Time,
        Driver = d.Driver,
        End_Address = d.End_Address,
        Start_Address = d.Start_Address,
        Bus_Id = d.Bus_Id,
        Year = d.Year,
        Arrival_Time = d.Arrival_Time,
      };

      if (tour.Arrival_Time < tour.Departing_Time)

        Session.Execute("insert into bus_tracker.Tour (tour_description, year, active, departing_time, tourId, driver, end_address, start_address, Bus_Id)"
            + $" values ('{tour.Tour_Description}', {tour.Year}, {tour.Active}, '{tour.Departing_Time.ToUnixTimeMilliseconds()}', {tour.TourId}, '{tour.Driver}', " +
            $"'{tour.End_Address}', '{tour.Start_Address}', {tour.Bus_Id})");
      else
        Session.Execute("insert into bus_tracker.Tour (tour_description, year, active, departing_time, tourId, driver, end_address, start_address, Bus_Id, arrival_time)"
            + $" values ('{tour.Tour_Description}', {tour.Year}, {tour.Active}, '{tour.Departing_Time.ToUnixTimeMilliseconds()}', {tour.TourId}, '{tour.Driver}', " +
            $"'{tour.End_Address}', '{tour.Start_Address}', {tour.Bus_Id}, {tour.Arrival_Time.ToUnixTimeMilliseconds()})");
    }

    public void StartTour(Tour d)
    {
      Random random = new Random();
      int duration = (random.Next() % 10000) + 60000;

      //generisanje fuel
      VehicleFuel vf = new VehicleFuel()
      {
        TourId = d.TourId,
        Fuel = (random.Next() % 1000) + 500,
        Reading_Time = DateTimeOffset.Now,
        Unit = "L",
      };

      VehicleSpeed sp = new VehicleSpeed()
      {
        TourId = d.TourId,
        Reading_time = DateTimeOffset.Now,
        Speed = 0,
        Unit = "km/h",
      };

      VehicleIdlingTime idle = new VehicleIdlingTime()
      {
        TourId = d.TourId,
        Reading_Time = DateTimeOffset.Now,
        Time_Idle = 0,
        Unit = "min",
      };

      VehicleLocation loc = new VehicleLocation()
      {
        TourId = d.TourId,
        Reading_time = DateTimeOffset.Now,
        Distance = 0,
        Location = new Location
        {
          Latitude = (random.Next() % 90) - 45,
          Longitude = (random.Next() % 90) + 45,
        }
      };

      generateFuel(vf, duration);
      generateSpeed(sp, duration);
      generateIdle(idle, duration);
      generateLocation(loc, duration);

      Task.Delay(duration + 1000).ContinueWith(a => StopTour(d));
    }

    private void StopTour(Tour obj)
    {
      obj.Arrival_Time = DateTimeOffset.Now;
      obj.Active = false;
      CreateTour(obj); //modifikacija postojece stavke u bazi
    }

    #endregion

    #region Fuel

    private void generateFuel(VehicleFuel vf, int remaining)
    {
      if (remaining < 0)
        return;
      remaining -= 3000;
      vf.Fuel -= 220;
      CreateFuel(vf);
      if (vf.Fuel < 300)
        vf.Fuel += 1000;
      Task.Delay(3000).ContinueWith(a => generateFuel(vf, remaining));
    }

    public RowSet getFuel(Cassandra.TimeUuid tourId)
    {
      return Session.Execute($"SELECT tourId, readingTime, fuel, unit FROM bus_tracker.vechiclefuel WHERE tourId = {tourId} ");
    }


    public void CreateFuel(VehicleFuel fuel)
    {
      Session.Execute("insert into bus_tracker.vechiclefuel (tourId, readingTime, fuel, Unit)"
          + $" values ({fuel.TourId}, '{DateTimeOffset.Now.ToUnixTimeMilliseconds()}', {fuel.Fuel}, '{fuel.Unit}')");
    }
    #endregion

    #region Location

    public List<VehicleLocation> getLocation(Cassandra.TimeUuid tourId)
    {
      var rows = Session.Execute($"SELECT * FROM bus_tracker.vechiclelocation WHERE tourId = {tourId} ");
      List<VehicleLocation> locations = new List<VehicleLocation>();
      foreach (Row row in rows)
      {
        VehicleLocation l = new VehicleLocation()
        {
          TourId = row.GetValue<Guid>("tourid"),
          Distance = row.GetValue<int>("distance"),
          Location = row.GetValue<Location>("location"),
          Reading_time = row.GetValue<DateTimeOffset>("readingtime"),
        };
        locations.Add(l);
      }

      return locations;
    }
    private void generateLocation(VehicleLocation loc, int remaining)
    {
      Random random = new Random();
      if (remaining < 0)
        return;
      remaining -= 3000;
      loc.Distance += random.Next() % 5;
      CreateLocation(loc);
      loc.Location.Latitude += (random.Next() % 6) - 3;
      loc.Location.Longitude += (random.Next() % 6) - 3;
      Task.Delay(3000).ContinueWith(a => generateLocation(loc, remaining));
    }



    public void CreateLocation(VehicleLocation loc)
    {
      Session.Execute("insert into bus_tracker.vechiclelocation (tourId, readingTime, distance, location)"
          + $" values ({loc.TourId}, '{DateTimeOffset.Now.ToUnixTimeMilliseconds()}', {loc.Distance}, {{longitude : {loc.Location.Longitude}, latitude : {loc.Location.Latitude}}})");
    }
    #endregion

    #region Speed

    public RowSet getSpeed(Cassandra.TimeUuid tourId)
    {
      return Session.Execute($"SELECT * FROM bus_tracker.vechiclespeed WHERE tourId = {tourId} ");
    }

    public void CreateSpeed(VehicleSpeed speed)
    {
      Session.Execute("insert into bus_tracker.vechiclespeed (tourId, readingTime, speed, Unit)"
          + $" values ({speed.TourId}, '{DateTimeOffset.Now.ToUnixTimeMilliseconds()}', {speed.Speed}, '{speed.Unit}')");
    }
    private void generateSpeed(VehicleSpeed sp, int remaining)
    {
      Random random = new Random();
      if (remaining < 0)
        return;
      remaining -= 3000;
      sp.Speed += random.Next() % 20 - 5;
      if (sp.Speed < 0)
        sp.Speed = 0;
      if (sp.Speed > 120)
        sp.Speed = 120;
      CreateSpeed(sp);
      Task.Delay(3000).ContinueWith(a => generateSpeed(sp, remaining));
    }
    #endregion

    #region Idle
    public RowSet getIdling(Cassandra.TimeUuid tourId)
    {
      return Session.Execute($"SELECT * FROM bus_tracker.vechicleidlingtime WHERE tourId = {tourId} ");
    }

    public void CreateIdling(VehicleIdlingTime idle)
    {
      Session.Execute("insert into bus_tracker.vechicleidlingtime (tourId, readingTime, time_idle, unit)"
          + $" values ({idle.TourId}, '{DateTimeOffset.Now.ToUnixTimeMilliseconds()}', {idle.Time_Idle}, '{idle.Unit}')");
    }

    private void generateIdle(VehicleIdlingTime idle, int remaining)
    {
      Random random = new Random();
      if (remaining < 0)
        return;
      remaining -= 3000;
      if ((random.Next() % 5) == 0)
        idle.Time_Idle += 1;

      CreateIdling(idle);
      Task.Delay(3000).ContinueWith(a => generateIdle(idle, remaining));
    }

    #endregion
  }
}