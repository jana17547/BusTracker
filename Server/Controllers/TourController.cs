using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cassandra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
  #region Tours

  [ApiController]
  [Route("[controller]")]
  public class ToursController : ControllerBase
  {
    public DataProvider data { get; set; }

    public ToursController()
    {
      data = new DataProvider();
    }



    [HttpGet]
    [Route("GetTours/{tour_description}&{year}")]
    public IActionResult GetTours(string tour_description, int year)
    {
      var result = new JsonResult(data.getTours(tour_description, year));
      return result;
    }

    [HttpDelete]
    [Route("DeleteTour/{tourId}")]
    public IActionResult DeleteTour([FromBody] Tour d, string tourId)
    {
      DateTimeOffset departingTime = d.Departing_Time;
      var tour_description = d.Tour_Description;
      var year = d.Year;
      data.DeleteTour(tour_description, year, Guid.Parse(tourId), departingTime);
      return Ok();
    }

    [HttpPost]
    [Route("CreateTour")]
    public IActionResult CreateTour([FromBody] Tour d)
    {
      d.TourId = TimeUuid.NewId();
      d.Active = true;
      d.Year = DateTime.Now.Year;
      d.Departing_Time = DateTimeOffset.Now;
      data.CreateTour(d);
      data.StartTour(d);
      return Ok();
    }

    #endregion

    #region Fuel

    [HttpGet]
    [Route("GetFuel/{tourId}")]
    public IActionResult GetFuel(string tourId)
    {
      return new JsonResult(data.getFuel(Guid.Parse(tourId)));
    }

    [HttpPost]
    [Route("CreateFuel/")]
    public IActionResult CreateFuel([FromBody] VehicleFuel fuel)
    {
      data.CreateFuel(fuel);
      return Ok();
    }

    #endregion

    #region Location

    [HttpGet]
    [Route("GetLocation/{tourId}")]
    public IActionResult GetLocation(string tourId)
    {
      return new JsonResult(data.getLocation(Guid.Parse(tourId)));
    }

    [HttpPost]
    [Route("CreateLocation/")]
    public IActionResult CreateLocation([FromBody] VehicleLocation loc)
    {
      data.CreateLocation(loc);
      return Ok();
    }

    #endregion

    #region Speed

    [HttpGet]
    [Route("GetSpeed/{tourId}")]
    public IActionResult GetSpeed(string tourId)
    {
      return new JsonResult(data.getSpeed(Guid.Parse(tourId)));
    }

    [HttpPost]
    [Route("CreateSpeed/")]
    public IActionResult CreateSpeed([FromBody] VehicleSpeed speed)
    {
      data.CreateSpeed(speed);
      return Ok();
    }

    #endregion

    #region Idling

    [HttpGet]
    [Route("GetIdling/{tourId}")]
    public IActionResult GetIdling(string tourId)
    {
      return new JsonResult(data.getIdling(Guid.Parse(tourId)));
    }

    [HttpPost]
    [Route("CreateIdling/")]
    public IActionResult CreateIdling([FromBody] VehicleIdlingTime idle)
    {
      data.CreateIdling(idle);
      return Ok();
    }
    #endregion

  }
}