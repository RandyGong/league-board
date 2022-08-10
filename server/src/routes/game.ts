import { Types, UpdateQuery } from "mongoose";
import { SignUpCommand } from "../commands/sign.up.command";
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
    // 考虑到由于比赛类型可能做过更改，修改前如果是对内联赛，那么按对报名数据会丢失
    // 这里把按对报名的人员都放到noTeam中
    if (!!latestGame.modifiedAt && latestGame.type !== "对内联赛") {
      for (const key in latestGame.participants.confirmed) {
        if (
          Object.prototype.hasOwnProperty.call(
            latestGame.participants.confirmed,
            key
          )
        ) {
          if (key !== "noTeam") {
            latestGame.participants.confirmed.noTeam.push(
              ...latestGame.participants.confirmed[key]
            );
            latestGame.participants.confirmed[key] = [];
          }
        }
      }
    }
    return res.json(latestGame);
  }
  res.send(null);
});

router.post("/", async (req, res, next) => {
  let game = <IGame>req.body;
  game.createdAt = new Date();

  await Game.insertMany([game]);
  res.end();
});

router.put("/:id", async (req, res, next) => {
  let game = <
    IGame & {
      _id: Types.ObjectId;
    }
  >req.body;

  game.modifiedAt = new Date();
  await Game.findByIdAndUpdate(req.params.id, game as UpdateQuery<IGame>);

  res.end();
});

router.delete("/:id", async (req, res, next) => {
  await Game.findByIdAndRemove(req.params.id);
  res.end();
});

router.put("/:id/sign-off", async (req, res, next) => {
  const participantObjectId = req.body._id;
  let game = await Game.findById(req.params.id);
  if (!game) {
    return res.send("Specified game not found!");
  }

  for (const key in game.participants.confirmed) {
    if (
      Object.prototype.hasOwnProperty.call(game.participants.confirmed, key)
    ) {
      game.participants.confirmed[key] = game.participants.confirmed[
        key
      ].filter((x) => x["_id"].toString() !== participantObjectId);
    }
  }

  game.participants.tbd = game.participants.tbd.filter(
    (x) => x["_id"].toString() !== participantObjectId
  );
  game.participants.leave = game.participants.leave.filter(
    (x) => x["_id"].toString() !== participantObjectId
  );

  await game.save();

  res.end();
});

router.put("/:id/sign-up", async (req, res, next) => {
  let command = <SignUpCommand>req.body;

  let game = await Game.findById(req.params.id);
  if (!game) {
    return res.send("Specified game not found!");
  }

  const dataToSave = {
    openId: command.openId,
    nickName: command.nickName,
    avatarUrl: command.avatarUrl,
    isDelegate: command.isDelegate,
    reason: command.reason,
  };

  if (command.status === "confirmed") {
    delete dataToSave.reason;
    if (!command.isDelegate) {
      if (
        !game.participants.confirmed[command.team].some(
          (x) => x.openId === command.openId || x.nickName === command.nickName
        )
      ) {
        game.participants.confirmed[command.team].push(dataToSave);
      }
    } else {
      game.participants.confirmed[command.team].push(dataToSave);
    }
  } else {
    if (
      !game.participants[command.status].some(
        (x) => x.openId === command.openId || x.nickName === command.nickName
      )
    ) {
      delete dataToSave.isDelegate;
      game.participants[command.status].push(dataToSave);
    }
  }
  await game.save();

  res.end();
});

module.exports = router;
