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

  public static async recudeParticipationTimes(openId: string) {
    let player = await PlayerData.findOne({ openId: openId });
    if (player) {
      player.participationTimes -= 1;
      await player.save();
    }
  }
}
