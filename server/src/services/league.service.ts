import { ILeagueRound, LeagueRound } from "../models/league.round";
import { PlayerData } from "../models/player.data";

export class LeagueService {
  public static async getAll() {
    const leagueRounds = await LeagueRound.find({}).sort({ roundNo: -1 });

    // if (!leagueRounds.length) return { hasValue: false };
    let merged: { white: number; blue: number; red: number } = null;
    if (leagueRounds && leagueRounds.length) {
      merged = this.getMerged(leagueRounds);
    }

    const playerData = await PlayerData.find({
      nickName: { $exists: false },
    }).sort({
      goal: -1,
    });

    return {
      merged,
      allRounds: leagueRounds,
      playerData,
    };
  }

  public static getMerged(leagueRounds: ILeagueRound[]): {
    till: string;
    white: number;
    blue: number;
    red: number;
  } {
    const latestRound = leagueRounds[0];
    let merged = {
      till: `截止${latestRound.date}，第${latestRound.roundNo}轮`,
      white: 0,
      blue: 0,
      red: 0,
      hasValue: true,
    };
    for (let round of leagueRounds) {
      merged.white += round.white;
      merged.blue += round.blue;
      merged.red += round.red;
    }
    return merged;
  }
}
