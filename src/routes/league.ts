import { LeagueRoundCommand } from "../commands/league.round.command";
import { ILeagueRound, LeagueRound } from "../models/league.round";

var express = require("express");
var router = express.Router();

/* GET league listing. */
router.get("/", async (req, res, next) => {
  const leagueRound = await LeagueRound.find({});
  res.send(leagueRound);
});

router.post("/", async (req, res, next) => {
  const round = <LeagueRoundCommand>req.body;

  const isExistCount = await LeagueRound.count({ date: round.date });
  if (isExistCount > 0) {
    res.send("当天的比赛数据已存在！");
    return;
  }

  const scoringArray: ILeagueRound[] = [];
  for (let score of round.scoring) {
    const roundByTeam = {
      date: round.date,
      team: score.team,
      score: score.score,
      createdAt: new Date(),
    } as ILeagueRound;
    scoringArray.push(roundByTeam);
  }
  await LeagueRound.insertMany(scoringArray);
  res.end();
});

router.put("/", async (req, res, next) => {
  const id = req.params.id;
  const { date, team, score } = req.body;
  await LeagueRound.findByIdAndUpdate(id, {});
  res.end();
});

router.delete("/:date", async (req, res, next) => {
  const date = req.params.date;
  await LeagueRound.deleteMany({ date });
  res.end();
});

module.exports = router;
