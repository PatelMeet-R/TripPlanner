const { Trip } = require("../Model/Trip");
const express = require("express");
const { data } = require("./data"); // Importing the data
const mongoose = require("mongoose");
const app = express();
const port = 3000;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Trip");
}

app.get("/data", async (req, res) => {
  try {
    const formattedData = data.map((trip) => {
      return {
        ...trip,
        startDate: new Date(trip.startDate), // Convert to Date
        endDate: new Date(trip.endDate),
      };
    });

    const savedTrips = await Trip.insertMany(formattedData);
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
