export class Tour {

    constructor(tourDescription, year, active, departing_time, tour_id, arrival_time, driver, end_address, start_address, bus_id) {
        this.bus_id = bus_id;
        this.tour_id = tour_id;
        this.driver = driver;
        this.start_address = start_address;
        this.end_address = end_address;
        this.year = year;
        this.departing_time = departing_time;
        this.arrival_time = arrival_time;
        this.tourDescription = tourDescription;
        this.active = active;
    }
}