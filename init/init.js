const { Trip } = require("../Model/Trip");
const express = require("express");
const { data } = require("./data"); // Importing the data
const mongoose = require("mongoose");
const app = express();
const port = 3000;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Trip");
}
// app.get("/", (req, res) => {
//   res.send("routing testing successful");
// });
// app.get("/trip", async (req, res) => {
//   try {
//     const trip1 = new Trip({
//       title: "Summer Vacation",
//       destination: {
//         country: "France",
//         location: "Paris",
//       },
//       startDate: "2023-07-15",
//       endDate: "2023-07-30",
//       description: "A relaxing trip to explore the beauty of Paris.",
//       budget: 2500,
//       status: "Planned",
//     });
//     const tripdata = await trip1.save();
//     console.log(tripdata);
//     console.log("trip add successfully");
//   } catch (err) {
//     console.log("error", err);
//   }
// });

app.get("/data", async (req, res) => {
  try {
    const formattedData = data.map((trip) => {
      return {
        ...trip,
        startDate: new Date(trip.startDate), // Convert to Date
        endDate: new Date(trip.endDate),
      };
    });
    const newdata=formattedData.map((data) => ({
      ...data,
      TripCreator: "67afc055f40834c244763c60",
    }));
    const savedTrips = await Trip.insertMany(newdata);
    console.log("Data added successfully");
    res.status(200).json({ data: savedTrips });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send("Data not initialized");
  }
});

main()
  .then((data) => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});
