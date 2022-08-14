"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var path = require("path");
// require("express-async-errors");
var mongoose = require("mongoose");
var port = 3210;
var playersRouter = require("./routes/player");
var leagueRoundRouter = require("./routes/league");
var gameRouter = require("./routes/game");
var commonRouter = require("./routes/common");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(function (err, req, res, next) {
    console.log("in handler1");
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    next(err);
});
app.use("/players", playersRouter);
app.use("/league", leagueRoundRouter);
app.use("/game", gameRouter);
app.use("/common", commonRouter);
mongoose
    .connect("mongodb+srv://randygong:VXszhkgQS3CGB4L@cluster0.5mtzbpk.mongodb.net/league-board?retryWrites=true&w=majority")
    .then(function () {
    console.log("Database connected");
})
    .catch(console.error);
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
app.get("/", function (req, res) {
    res.send("Hello World!");
});
//# sourceMappingURL=index.js.map