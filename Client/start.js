import { Tour } from "./tour.js";

export class Start {
  constructor() {
    this.container = null;
    this.middleTable = null;
    this.rightTable = null;
    this.rightTableContent = null;
    this.selectedTour = null;
  }

  draw(host) {
    if (!host) throw new Error("Host is not defined");

    const name = document.createElement("div");
    name.className = "name";
    host.appendChild(name);

    const h1 = document.createElement("h1");
    h1.className = "h1";
    name.appendChild(h1);
    h1.innerHTML = "Bus Tracker";

    const h3 = document.createElement("h3");
    h3.className = "h3";
    name.appendChild(h3);
    h3.innerHTML = "Tracking tours from start to finish";

    this.container = document.createElement("div");
    this.container.className = "container";
    host.appendChild(this.container);

    const leftStart = document.createElement("div");
    leftStart.className = "leftStart";
    this.container.appendChild(leftStart);

    const tableDiv = document.createElement("div");
    tableDiv.className = "tableDiv";
    this.container.appendChild(tableDiv);

    this.drawMiddle(tableDiv);

    const rightTableDiv = document.createElement("div");
    this.container.appendChild(rightTableDiv);

    this.drawRightTable(rightTableDiv);

    this.drawLeft(leftStart);
  }

  drawRightTable(host) {
    const tableDiv = document.createElement("div");
    this.rightTable = tableDiv;
    tableDiv.className = "rightTableDiv";
    host.appendChild(tableDiv);
  }

  drawRightTableButtons(host, tour_id) {
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttonsDiv";
    host.appendChild(buttonsDiv);

    const h1 = ["Fuel", "Unit", "Reading time"];
    const h2 = ["Time Idle", "Unit", "Reading time"];
    const h3 = ["Speed", "Unit", "Reading time"];
    const h4 = ["Location", "Distance from beginning", "Reading time"];

    const buttonFuel = document.createElement("button");
    buttonFuel.className = "rightButton";
    buttonFuel.innerHTML = "Fuel";
    buttonFuel.onclick = () => {
      fetch(`https://localhost:44361/Tours/GetFuel/${tour_id}`).then(
        (p) => {
          p.json().then((data) => {
            host.removeChild(this.rightTableContent);
            this.drawRightTableContent(host, data, h1);
          });
        }
      );
    };
    buttonsDiv.appendChild(buttonFuel);

    const buttonIdling = document.createElement("button");
    buttonIdling.className = "rightButton";
    buttonIdling.innerHTML = "Idling time";
    buttonIdling.onclick = () => {
      fetch(`https://localhost:44361/Tours/GetIdling/${tour_id}`).then(
        (p) => {
          p.json().then((data) => {
            host.removeChild(this.rightTableContent);
            this.drawRightTableContent(host, data, h2);
          });
        }
      );
    };
    buttonsDiv.appendChild(buttonIdling);

    const buttonSpeed = document.createElement("button");
    buttonSpeed.className = "rightButton";
    buttonSpeed.innerHTML = "Speed";
    buttonSpeed.onclick = () => {
      fetch(`https://localhost:44361/Tours/GetSpeed/${tour_id}`).then(
        (p) => {
          p.json().then((data) => {
            console.log("speed: " + data);
            host.removeChild(this.rightTableContent);
            this.drawRightTableContent(host, data, h3);
          });
        }
      );
    };
    buttonsDiv.appendChild(buttonSpeed);

    const buttonLocation = document.createElement("button");
    buttonLocation.className = "rightButton";
    buttonLocation.innerHTML = "Location";
    buttonLocation.onclick = () => {
      let list = [];
      fetch(
        `https://localhost:44361/Tours/GetLocation/${tour_id}`
      ).then((p) => {
        p.json().then((data) => {
          data.forEach((element) => {
            list.push([
              0,
              element.reading_time,
              element.location.longitude +
                "°  " +
                element.location.latitude +
                "°",
              element.distance,
            ]);
          });
          host.removeChild(this.rightTableContent);
          this.drawRightTableContent(host, list, h4);
        });
      });
    };

    buttonsDiv.appendChild(buttonLocation);

    fetch(`https://localhost:44361/Tours/GetFuel/${tour_id}`).then(
      (p) => {
        p.json().then((data) => {
          console.log("fuel: " + data);
          this.drawRightTableContent(host, data, h1);
        });
      }
    );
  }

  drawRightTableContent(host, data, h) {
    let table = document.createElement("table");
    table.className = "table";
    host.appendChild(table);

    this.rightTableContent = table;

    const header = document.createElement("tr");
    table.appendChild(header);

    h.forEach((hName) => {
      const c = document.createElement("th");
      c.innerHTML = hName;
      header.appendChild(c);
    });

    data.forEach((row) => {
      const r = document.createElement("tr");
      table.appendChild(r);

      const c2 = document.createElement("td");
      c2.innerHTML = row[2];
      r.appendChild(c2);

      const c3 = document.createElement("td");
      c3.innerHTML = row[3];
      r.appendChild(c3);

      const t = new Date(row[1]);
      const tf =
        t.getDate() +
        "-" +
        (t.getMonth() + 1) +
        "-" +
        t.getFullYear() +
        " " +
        t.getHours() +
        ":" +
        t.getMinutes() +
        ":" +
        t.getSeconds();

      const c4 = document.createElement("td");
      c4.innerHTML = tf;
      r.appendChild(c4);
    });
  }

  drawMiddle(host) {
    let table = document.createElement("table");
    this.middleTable = table;
    table.className = "table";
    host.appendChild(table);
  }

  drawTourHeader(table) {
    const header = document.createElement("tr");
    table.appendChild(header);

    const tourDescription = document.createElement("th");
    tourDescription.innerHTML = "TourDescription";
    header.appendChild(tourDescription);

    const year = document.createElement("th");
    year.innerHTML = "Year";
    header.appendChild(year);

    const active = document.createElement("th");
    active.innerHTML = "Active";
    header.appendChild(active);

    const departing_time = document.createElement("th");
    departing_time.innerHTML = "Departing time";
    header.appendChild(departing_time);

    const arrival_time = document.createElement("th");
    arrival_time.innerHTML = "Arrival time";
    header.appendChild(arrival_time);

    const driver = document.createElement("th");
    driver.innerHTML = "Driver";
    header.appendChild(driver);

    const startAddress = document.createElement("th");
    startAddress.innerHTML = "Start address";
    header.appendChild(startAddress);

    const endAddress = document.createElement("th");
    endAddress.innerHTML = "End address";
    header.appendChild(endAddress);

    const bus_id = document.createElement("th");
    bus_id.innerHTML = "Bus";
    header.appendChild(bus_id);
  }

  drawTourData(table, tour) {
    const arrival = new Date(tour.arrival_time);
    const departing = new Date(tour.departing_time);
    let arrivalFormated;
    if (tour.arrival_time != null)
      arrivalFormated =
        arrival.getDate() +
        "-" +
        (arrival.getMonth() + 1) +
        "-" +
        arrival.getFullYear() +
        " " +
        arrival.getHours() +
        ":" +
        arrival.getMinutes();
    else arrivalFormated = " ";

    const departingFormated =
      departing.getDate() +
      "-" +
      (departing.getMonth() + 1) +
      "-" +
      departing.getFullYear() +
      " " +
      departing.getHours() +
      ":" +
      departing.getMinutes();

    const row = document.createElement("tr");
    row.classList.add("hover");
    row.onclick = () => {
      const sel = this.container.querySelector(".selected");
      if (sel != null) sel.classList.remove("selected");

      this.selectedTour = tour;

      const par = this.rightTable.parentNode;
      par.removeChild(this.rightTable);
      this.drawRightTable(par);
      this.drawRightTableButtons(this.rightTable, tour.tour_id);
      row.classList.add("selected");
    };
    table.appendChild(row);

    const tourDescription = document.createElement("td");
    tourDescription.innerHTML = tour.tourDescription;
    row.appendChild(tourDescription);

    const year = document.createElement("td");
    year.innerHTML = tour.year;
    row.appendChild(year);

    const active = document.createElement("td");
    active.innerHTML = tour.active;
    row.appendChild(active);

    const departing_time = document.createElement("td");
    departing_time.innerHTML = departingFormated;
    row.appendChild(departing_time);

    const arrival_time = document.createElement("td");
    arrival_time.innerHTML = arrivalFormated;
    row.appendChild(arrival_time);

    const driver = document.createElement("td");
    driver.innerHTML = tour.driver;
    row.appendChild(driver);

    const startAddress = document.createElement("td");
    startAddress.innerHTML = tour.start_address;
    row.appendChild(startAddress);

    const endAddress = document.createElement("td");
    endAddress.innerHTML = tour.end_address;
    row.appendChild(endAddress);

    const bus_id = document.createElement("td");
    bus_id.innerHTML = tour.bus_id;
    row.appendChild(bus_id);

    const delBtn = document.createElement("td");
    const deleteTourBtn = document.createElement("button");
    deleteTourBtn.innerHTML = "Delete";
    deleteTourBtn.className = "btnDeleteTour";
    delBtn.appendChild(deleteTourBtn);
    row.appendChild(delBtn);
    deleteTourBtn.onclick = (e) => 
    {
      e.stopPropagation(); 
      console.log("tourId: ",tour.tour_id);

      fetch(`https://localhost:44361/Tours/DeleteTour/${tour.tour_id}`, {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            tour_description: tour.tourDescription,
            year: tour.year,
            departing_time: tour.departing_time,
          }),
        }).then((p) => {
          if (p.ok) {
            this.showTours();
            alert("Tour has been deleted successfully!");
          }
          else{
            console.log("error");
            console.log("error: " + p.text());
          }
        })
        .catch((error) => {
          console.log(error)
        });;
    }
  }

  drawLeft(host) {
    const buttonSection = document.createElement("div");
    buttonSection.className = "buttonSection";
    host.appendChild(buttonSection);

    this.drawTourForm(buttonSection);

    const startTour = document.createElement("button");
    startTour.className = "startTour sectionbutton";
    buttonSection.appendChild(startTour);
    startTour.onclick = () => {
      const input = this.container.querySelectorAll(".DFinput");
      const bus = input[0].value;
      const driver = input[1].value;
      const startAddress = input[2].value;
      const endAddress = input[3].value;
      const tourDescription = this.container.querySelector(".startTourDescription").value;
      
      if (bus == "" || driver == "" || startAddress == "" || endAddress == "")
        alert("Input all values");
      else
        fetch(`https://localhost:44361/Tours/CreateTour`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Driver: driver,
            Start_Address: startAddress,
            End_Address: endAddress,
            Bus_Id: bus,
            Tour_Description: tourDescription,
          }),
        }).then((p) => {
          if (p.ok) {
            alert("Tour has started successfully!");
          }
          else{
            console.log("error");
            console.log("error: " + p.text());
          }
        })
        .catch((error) => {
          console.log(error)
        });;
    };
    startTour.innerHTML = "Start tour";

    this.drawShowTours(buttonSection);

    const showTour = document.createElement("button");
    showTour.className = "showTour, sectionbutton";
    buttonSection.appendChild(showTour);
    showTour.onclick = () => {
      this.showTours();
    };
    showTour.innerHTML = "Show tours";
  }

  showTours(){
    this.selectedTour = null;
      const tourDescription = this.container.querySelector(".tourDescriptionSelect").value;
      const year = this.container.querySelector(".year").value;
      fetch(
        `https://localhost:44361/Tours/GetTours/${tourDescription}&${year}`
      ).then((p) => {
        parent = this.middleTable.parentNode;
        parent.removeChild(this.middleTable);
        this.drawMiddle(parent);
        this.drawTourHeader(this.middleTable);

        const parent2 = this.rightTable.parentNode;
        parent2.removeChild(this.rightTable);
        this.drawRightTable(parent2);

        p.json().then((tours) => {
          tours.forEach((tour) => {
            const del = new Tour(
              tour[0],
              tour[1],
              tour[4],
              tour[2],
              tour[3],
              tour[5],
              tour[7],
              tour[8],
              tour[9],
              tour[6]
            );

            this.drawTourData(this.middleTable, del);
          });
        });
      });
  }

  drawTourForm(host) {
    const DF = document.createElement("div");
    DF.className = "DF";
    host.appendChild(DF);

    this.drawDFormElement(DF, "Bus number: ", "number", "BusID");
    this.drawDFormElement(DF, "Driver: ", "text", "Driver");
    this.drawDFormElement(DF, "Start Address: ", "text", "StartAddres");
    this.drawDFormElement(DF, "End Address: ", "text", "EndAddress");

    const cri = document.createElement("div");
    cri.className = "elContainer";
    DF.appendChild(cri);

    const tourDescription = [
      "Ekskurzija",
      "Letovanje",
      "Zimovanje",
      "Nova godina",
      "Jednodnevni izlet",
    ];
    let tourDescriptionSelect = document.createElement("select");
    tourDescriptionSelect.className = "select tourDescriptionStart startTourDescription";
    const lbl = document.createElement("label");
    lbl.innerHTML = "TourDescription: ";
    cri.appendChild(lbl);

    for (let i = 0; i < tourDescription.length; i++) {
      const c = document.createElement("option");
      c.value = tourDescription[i];
      c.innerHTML = tourDescription[i];
      tourDescriptionSelect.appendChild(c);
    }

    cri.appendChild(tourDescriptionSelect);
  }

  drawDFormElement(host, lblText, tip, className) {
    const elContainer = document.createElement("div");
    elContainer.className = "elContainer";
    host.appendChild(elContainer);

    const label = document.createElement("label");
    label.innerHTML = lblText;
    elContainer.appendChild(label);

    const el = document.createElement("input");
    el.type = tip;
    el.className = className + " DFinput";
    elContainer.appendChild(el);
  }

  drawShowTours(host) {
    const cri = document.createElement("div");
    cri.className = "cri";
    host.appendChild(cri);

    const tourDescription = [
      "Ekskurzija",
      "Letovanje",
      "Zimovanje",
      "Nova godina",
      "Jednodnevni izlet",
    ];
    let tourDescriptionSelect = document.createElement("select");
    tourDescriptionSelect.className = "select tourDescriptionSelect";
    const lbl = document.createElement("label");
    lbl.innerHTML = "TourDescription: ";
    cri.appendChild(lbl);

    for (let i = 0; i < tourDescription.length; i++) {
      const c = document.createElement("option");
      c.value = tourDescription[i];
      c.innerHTML = tourDescription[i];
      tourDescriptionSelect.appendChild(c);
    }

    cri.appendChild(tourDescriptionSelect);

    const y = document.createElement("div");
    y.className = "cri";
    host.appendChild(y);

    const lbly = document.createElement("label");
    lbly.innerHTML = "Year";
    y.appendChild(lbly);

    const year = document.createElement("input");
    year.type = "number";
    year.value = new Date().getFullYear();
    year.min = 2000;
    year.max = new Date().getFullYear();
    year.className = "year select";
    y.appendChild(year);
  }
}
