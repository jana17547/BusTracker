# Bus Tracker 🚌

## Introduction 🚀
Welcome to the **Bus Tracker** application, the ultimate tool for real-time monitoring of bus tours. Designed to streamline operations and enhance tracking accuracy, Bus Tracker enables users to initiate and monitor bus tours with live data updates.

## Features 🌟

### Start Tour
Launch a new bus tour by filling out the necessary information in the top left corner of the site and clicking the **Start Tour** button. This initiates the tour simulation.

### Tour Simulation
Continuously tracks simulated data such as **Fuel**, **Idling Time**, **Speed**, and **Location**, which updates every 5 seconds to mimic real sensor data.

### Historical Data
Filter and view past tours by selecting the tour type and year. Click on any listed tour to view detailed data collected during that tour.

### Database Design
- **Partition Key**: `TourDescription` and `year` for effective data organization and retrieval.
- **Clustering Key**: `departing time` and `tour id`, ensuring data is sorted by departure time and uniquely identified by tour ID.

## Technologies Used ⚙️
Bus Tracker utilizes a sophisticated database schema to manage and simulate bus tour data efficiently.

### Partition Key for Tour Data
Optimized for frequent searches by `TourDescription` and filtering by `year`.

### Clustering Key for Deliveries
Organizes deliveries by `departing time` and ensures uniqueness with `tour id`.

### Sensor Data Keys
For **Fuel**, **Idling Time**, **Speed**, and **Location** data, `tour id` serves as the partition key, while `reading time` is the clustering key.
