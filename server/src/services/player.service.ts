import { SignUpCommand } from "../commands/sign.up.command";
import { PlayerData } from "../models/player.data";
import { GameService } from "./game.service";

export class PlayerService {
  public static async updateParticipationTimes(
    command: SignUpCommand
  ): Promise<number> {
    let participationTimes = 1;
    let player = await PlayerData.findOne({ openId: command.openId });
    if (player) {
      player.participationTimes += 1;
      player.save();
      participationTimes = player.participationTimes;
    } else {
      let playerData = GameService.signUpCommandToPlayerData(command);
      PlayerData.insertMany([playerData]);
    }

    return participationTimes;
  }

  public static async addParticipationTimes(
    openId: string,
    timesDiff: number
  ): Promise<number> {
    let player = await PlayerData.findOne({ openId: openId });
    if (!player) {
      throw new Error("未找到该openId对应的人员");
    }

    player.participationTimes += timesDiff;
    await player.save();
    return player.participationTimes;
  }
}
