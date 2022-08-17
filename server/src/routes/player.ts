import { PlayerDataCommand } from "../commands/player.data.command";
import { toAsyncRouter } from "../errorHandler";
import { PlayerData } from "../models/player.data";

var express = require("express");
var router = toAsyncRouter(express.Router());

/* GET players listing. */
router.get("/", async (req, res, next) => {
  const playerData = await PlayerData.find();
  res.send(playerData);
});

router.get("/all-players-for-board", async (req, res, next) => {
  const playerData = await PlayerData.find({ nickName: { $exists: false } });
  res.send(playerData);
});

router.get("/:openId", async (req, res, next) => {
  const playerData = await PlayerData.findOne({ openId: req.params.openId });
  res.send(playerData);
});

router.get("/goal-rank", async (req, res, next) => {
  const playerData = await PlayerData.find({
    nickName: { $exists: false },
  }).sort({ goal: -1 });
  res.send(playerData);
});
router.get("/assist-rank", async (req, res, next) => {
  const playerData = await PlayerData.find({
    nickName: { $exists: false },
  }).sort({
    assist: -1,
  });
  res.send(playerData);
});

router.post("/", async (req, res, next) => {
  const data = <PlayerDataCommand>req.body;
  const playerData = await PlayerData.findOne({ name: data.name });
  if (playerData) {
    return res
      .json({
        error: true,
        msg: "此姓名球员已存在！",
      })
      .end();
  }
  const newData = new PlayerData(data);
  newData.createdAt = new Date();
  await newData.save();
  res.end();
});

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const command = <PlayerDataCommand>req.body;
  const playerData = await PlayerData.findOne({ name: command.name });
  if (playerData && playerData._id.toString() !== id) {
    return res
      .json({
        error: true,
        msg: "此姓名球员已存在！",
      })
      .end();
  }
  command.modifiedAt = new Date();
  await PlayerData.findByIdAndUpdate(id, command);
  res.end();
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  await PlayerData.findByIdAndRemove(id);
  res.end();
});

module.exports = router;
