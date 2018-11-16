const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "pug");

app.use(express.static("public"));
app.set("views", "./views");
app.use(express.urlencoded());
const PORT = process.env.PORT || 3000;

// mongoose.connect(
//   "mongodb://localhost:27017/rsvp",
//   { useNewUrlParser: true }
// );

let database = mongoose.connection;
database.on("error", console.error.bind(console, "Connection Error: "));
database.once("open", function() {
  const guestSchema = new mongoose.Schema({
    name: String,
    email: String,
    attending: Boolean,
    guests: Number
  });
  const Response = mongoose.model("Response", guestSchema);

  // views folder for pug pages

  // app.use(express.json());

  app.get("/", (request, response) => {
    response.render("attendanceForm");
  });

  app.get("/guests", (request, response) => {
    Response.find((err, guests) => {
      console.log(guests);
      if (err) return console.error(err);
      response.render("guests", {
        attending: guests.filter(guest => guest.attending === true),
        notAttending: guests.filter(guest => guest.attending === false)
      });
    });
  });

  app.post("/reply", (request, response) => {
    console.log(request.body);
    newGuest = new Response({
      name: request.body.name,
      email: request.body.email,
      attending: request.body.attending,
      guests: request.body.guests
    });
    newGuest.save((err, newGuest) => {
      if (err) return console.error(`${err}`);
      response.render("reply");
      console.log(`Guest: ${newGuest.name}`);
    });
  });
});
databaseName = "rsvpform";

app.listen(PORT, () => {
  mongoose.connect("mongodb://localhost:27017/rsvp");
  console.log(`Listening on port ${PORT}!`);
});
