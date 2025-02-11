const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Trip } = require("./Model/Trip");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./Utils/wrapAsync.js");

dotenv.config();
let port = 8000;

app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "View"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));
app.use(methodOverride("_method"));

async function main() {
  // console.log(process.env.DB_URL)
  await mongoose.connect(process.env.DB_URL);
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
// // index route
app.get("/trips", async (req, res) => {
  try {
    let allTrips = await Trip.find({});
    res.render("trips/index.ejs", { allTrips });
  } catch (err) {
    console.log("get route for index", err);
  }
});
// create route
app.post("/trips", async (req, res) => {
  let tripData = req.body.trip;
  console.log(tripData);
  const tripDetails = await Trip.insertOne(tripData);
  // res.status(200).json({'message': "success" , tripDetails})
  res.redirect("/trips");
});

app.get("/trips/new", async (req, res) => {
  try {
    res.render("trips/new.ejs");
  } catch (err) {
    console.log("error et rendering new EJS", err);
  }
});
// edit route
app.get("/trips/:id/edit", async (req, res) => {
  // res.send("this is the edit route");
  let { id } = req.params;
  let trip = await Trip.findById(id);
  res.render("trips/edit.ejs", { trip });
});
app.put("/trips/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let tripData = req.body.trip;
    const tripUpdate = await Trip.findByIdAndUpdate(
      id,
      { ...tripData },
      { runValidators: true }
    );
    // res.status(200).json({ msg: "success", tripUpdate});

    res.redirect("/trips");
  } catch (error) {
    console.log("this error occure at edit route", error);
  }
});
// destroy route
app.delete("/trips/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.redirect("/trips");
  } catch (error) {
    console.log("this error occure at delete route", error);
  }
});

main()
  .then((data) => {
    console.log("Database connection is successful");
    app.listen(port, (req, res) => {
      console.log(`server is listening to port no ${port}"`);
    });
  })
  .catch((err) => {
    console.log("Database connection Failed", err);
  });
