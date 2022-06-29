import { PlayerData } from "../models/player.data";

var express = require("express");
var router = express.Router();

/* GET players listing. */
router.get("/", async (req, res, next) => {
  const playerData = await PlayerData.find({});
  res.send(playerData);
});

module.exports = router;
