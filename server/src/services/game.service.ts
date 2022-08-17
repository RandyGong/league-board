import { SignUpCommand } from "../commands/sign.up.command";
import { IGame } from "../models/game";
import { IPlayerData, PlayerData } from "../models/player.data";
import { PlayerService } from "./player.service";

export class GameService {
  public static isRegisteredInGame(game: IGame, openId: string) {
    let isAlreadyJoined = false;

    // 任意一队里有这个人，且不是代报名的，就不能再报了
    for (const key in game.participants.confirmed) {
      if (
        Object.prototype.hasOwnProperty.call(game.participants.confirmed, key)
      ) {
        if (
          game.participants.confirmed[key].some(
            (x) => !x.isDelegate && x.openId === openId
          )
        ) {
          isAlreadyJoined = true;
        }
      }
    }

    // 待定了或者请假了
    if (
      game.participants.tbd.some((x) => x.openId === openId && !x.isDelegate) ||
      game.participants.leave.some((x) => x.openId === openId && !x.isDelegate)
    ) {
      isAlreadyJoined = true;
    }

    return isAlreadyJoined;
  }

  public static signUpCommandToPlayerData(command: SignUpCommand) {
    return {
      openId: command.openId,
      name: "",
      nickName: command.nickName,
      avatarUrl: command.avatarUrl,
      goal: 0,
      assist: 0,
      participationTimes: 1,
      createdAt: new Date(),
    } as IPlayerData;
  }

  public static async moveOutFromAllStatus(
    game: IGame,
    participantObjectId: string,
    isReduceParticipationTimes = true
  ) {
    for (const key in game.participants.confirmed) {
      if (
        Object.prototype.hasOwnProperty.call(game.participants.confirmed, key)
      ) {
        if (isReduceParticipationTimes) {
          let data = game.participants.confirmed[key].find(
            (x) => !x.isDelegate && x["_id"].toString() === participantObjectId
          );
          if (data) {
            data.participationTimes = await PlayerService.addParticipationTimes(
              data.openId,
              -1
            );
          }
        }

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
  }

  public static getStatusOfParticipant(game: IGame, _id: string): string {
    if (!game || !_id) {
      throw new Error("请检查参数");
    }

    for (const key in game.participants.confirmed) {
      if (
        Object.prototype.hasOwnProperty.call(game.participants.confirmed, key)
      ) {
        if (
          game.participants.confirmed[key].some(
            (x) => x["_id"].toString() === _id
          )
        ) {
          return "confirmed";
        }
      }
    }

    if (game.participants.tbd.some((x) => x["_id"].toString() === _id)) {
      return "tbd";
    }
    if (game.participants.leave.some((x) => x["_id"].toString() === _id)) {
      return "leave";
    }
    return null;
  }

  public static getTeamNameByCode(code: string) {
    const teams = {
      white: "白队",
      blue: "蓝队",
      red: "红队",
    };
    return teams[code];
  }

  public static getStatusNameByCode(code: string) {
    const teams = {
      confirmed: "已报名",
      tbd: "待定",
      leave: "请假",
    };
    return teams[code];
  }
}
