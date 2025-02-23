const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { isloggin } = require("./Middleware.js");
const { authRouter } = require("./Routes/user.js");
const { TripRouter } = require("./Routes/trip.js");
const { ActivityRouter } = require("./Routes/activity.js");
const ExpressError = require("./Utils/Error/ExpressError.js");

dotenv.config();
let port = 8000;

app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "View"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "Public")));
app.use(methodOverride("_method"));
app.use(cookieParser());
const sessionOption = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOption));
app.use(flash());

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.use(isloggin, (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.showSearch = true; //show the search bar

  next();
});
// Ensure sensitive pages are not cached by the browser by setting appropriate HTTP headers
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  next();
});

app.use("/", authRouter);
app.use("/trips", TripRouter);
app.use("/trips/:id/activities", ActivityRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).render("User/Error.ejs", { message });
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
