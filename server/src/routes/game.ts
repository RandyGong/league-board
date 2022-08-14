import { Types, UpdateQuery } from "mongoose";
import { SignUpCommand } from "../commands/sign.up.command";
import { asyncHandler, toAsyncRouter } from "../errorHandler";
import { Game, IGame } from "../models/game";
import { PlayerData } from "../models/player.data";
import { GameService } from "../services/game.service";
import { PlayerService } from "../services/player.service";

var express = require("express");
var router = toAsyncRouter(express.Router());

router.get("/", async (req, res, next) => {
  let allGames = await Game.find(
    {},
    "title date type aSide fee.randomMember location.name"
  ).sort({ "date.startTime": -1 });
  if (allGames.length) {
    if (allGames[0].date.endTime.getTime() > new Date().getTime()) {
      allGames = allGames.slice(1);
    }
  }
  res.send(allGames);
});

router.get("/:_id", async (req, res, next) => {
  const game = await Game.findById(req.params._id);
  res.send(game);
});

router.get("/current", async (req, res, next) => {
  const latestGame = await Game.findOne({}).sort({ "date.startTime": -1 });
  if (!latestGame) {
    return res.send(null);
  }

  if (latestGame.date.endTime.getTime() > new Date().getTime()) {
    // 考虑到由于比赛类型可能做过更改，修改前如果是对内联赛，那么按队伍报名的数据会丢失
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
    throw new Error("未找到所指的的比赛!");
  }

  await GameService.moveOutFromConfirmed(game, participantObjectId, true);

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
    throw new Error("当前比赛未找到!");
  }

  const dataToSave = {
    openId: command.openId,
    nickName: command.nickName,
    avatarUrl: command.avatarUrl,
    isDelegate: command.isDelegate,
    reason: command.reason,
    participationTimes: 1,
    appliedAt: new Date(),
  };

  if (command.status === "confirmed") {
    delete dataToSave.reason;

    if (!command.isDelegate) {
      if (GameService.isRegisteredInGame(game, command.openId)) {
        throw new Error("你已经报过名(或待定、请假)了，如需改变，请先取消报名");
      }

      dataToSave.participationTimes =
        await PlayerService.updateParticipationTimes(command);
      game.participants.confirmed[command.team].push(dataToSave);
    } else {
      delete dataToSave.participationTimes;
      game.participants.confirmed[command.team].push(dataToSave);
    }
  } else {
    if (GameService.isRegisteredInGame(game, command.openId)) {
      throw new Error("你已经报过名(或待定、请假)了，如需改变，请先取消报名");
    }

    delete dataToSave.isDelegate;
    delete dataToSave.participationTimes;
    game.participants[command.status].push(dataToSave);
  }
  await game.save();

  if (dataToSave.participationTimes) {
    return res.json({
      participationTimes: dataToSave.participationTimes,
    });
  }

  res.end();
});

router.put("/:id/move-team", async (req, res, next) => {
  const { moveToTeam, participant } = req.body;
  let game = await Game.findById(req.params.id);
  if (!game) {
    throw new Error("未找到所指的的比赛!");
  }

  await GameService.moveOutFromConfirmed(game, participant._id, false);
  if (
    Object.prototype.hasOwnProperty.call(
      game.participants.confirmed,
      moveToTeam
    )
  ) {
    if (
      game.participants.confirmed[moveToTeam].some(
        (x) => x._id.toString() === participant._id
      )
    ) {
      throw new Error(
        `该球员已经在${GameService.getTeamNameByCode(moveToTeam)}了`
      );
    }

    // delete participant._id;
    game.participants.confirmed[moveToTeam].push(participant);
    await game.save();
  }

  res.end();
});

module.exports = router;
