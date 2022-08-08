import { LeagueRoundCommand } from "../commands/league.round.command";
import { ILeagueRound, LeagueRound } from "../models/league.round";
import { LeagueService } from "../services/league.service";

var express = require("express");
var router = express.Router();

/* GET league listing. */
router.get("/", async (req, res, next) => {
  const leagueRound = await LeagueRound.find({}).sort({ roundNo: -1 });
  res.send(leagueRound);
});
router.get("/all", async (req, res, next) => {
  const all = await LeagueService.getAll();
  res.send(all);
});

router.get("/merged", async (req, res, next) => {
  const leagueRounds = await LeagueRound.find({}).sort({ roundNo: -1 });

  if (!leagueRounds.length) return res.send({ hasValue: false });

  const merged = LeagueService.getMerged(leagueRounds);
  res.send(merged);
});

router.post("/", async (req, res, next) => {
  const round = <LeagueRoundCommand>req.body;

  const isExistCount = await LeagueRound.count({
    $or: [{ date: round.date }, { roundNo: round.roundNo }],
  });
  if (isExistCount > 0) {
    res.json({
      error: true,
      msg: "当天(或当轮)的比赛数据已存在！",
    });
    return;
  }

  round.createdAt = new Date();
  await LeagueRound.insertMany([round]);

  // const scoringArray: ILeagueRound[] = [];
  // for (let score of round.scoring) {
  //   const roundByTeam = {
  //     date: round.date,
  //     roundNo: round.roundNo,
  //     team: score.team,
  //     score: score.score,
  //     createdAt: new Date(),
  //   } as ILeagueRound;
  //   scoringArray.push(roundByTeam);
  // }
  // await LeagueRound.insertMany(scoringArray);
  res.end();
});

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const command = <LeagueRoundCommand>req.body;

  const existRounds = await LeagueRound.find({
    $or: [{ date: command.date }, { roundNo: command.roundNo }],
  });

  if (
    existRounds.length &&
    existRounds.filter((x) => x._id.toString() !== id).length > 0
  ) {
    res.json({
      error: true,
      msg: "当天(或当轮)的比赛数据已存在！",
    });
    return;
  }

  command.modifiedAt = new Date();
  await LeagueRound.findByIdAndUpdate(id, command);
  res.end();
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  await LeagueRound.findByIdAndRemove(id);
  res.end();
});

module.exports = router;
