import { Types, UpdateQuery } from "mongoose";
import { Game, IGame } from "../models/game";

var express = require("express");
var router = express.Router();

router.get("/", async (req, res, next) => {
  const allGames = await Game.find({});
  res.send(allGames);
});

router.get("/current", async (req, res, next) => {
  const latestGame = await Game.findOne({}).sort({ "date.startTime": -1 });
  if (!latestGame) {
    return res.send(null);
  }

  if (latestGame.date.endTime.getTime() > new Date().getTime()) {
    return res.json(latestGame);
  }
  res.send(null);
});

router.post("/", async (req, res, next) => {
  let game = <IGame>req.body;
  game.createdAt = new Date();
  console.log(game);

  await Game.insertMany([game]);
  res.end();
});

router.put("/:id", async (req, res, next) => {
  let game = <
    IGame & {
      _id: Types.ObjectId;
    }
  >req.body;
  const id = req.params.id;
  game.modifiedAt = new Date();
  console.log("game", game);
  await Game.findByIdAndUpdate(id, game as UpdateQuery<IGame>);
  //   let targetGame = await Game.findById(id);
  //   if (targetGame) {
  //     targetGame = game;
  //     targetGame.modifiedAt = new Date();
  //     console.log("targetGame", targetGame);
  //     await targetGame.save();
  //   }

  res.end();
});

module.exports = router;
