const express = require("express");
const app = express();
const path = require("path");
import * as mongoose from "mongoose";

const port = 3210;

const playersRouter = require("./routes/player");
const leagueRoundRouter = require("./routes/league");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/players", playersRouter);
app.use("/league", leagueRoundRouter);

mongoose
  .connect(
    "mongodb+srv://randygong:VXszhkgQS3CGB4L@cluster0.5mtzbpk.mongodb.net/league-board?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
