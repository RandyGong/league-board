import * as mongoose from "mongoose";

export interface IPlayerData extends mongoose.Document {
  openId: string;
  name: string;
  nickName: string; // wx
  avatarUrl: string;
  goal: number;
  assist: number;
  participationTimes: number;
  createdAt?: Date;
  modifiedAt?: Date;
}

export const playerDataSchema = new mongoose.Schema({
  openId: String,
  name: String,
  nickName: String,
  avatarUrl: String,
  goal: Number,
  assist: Number,
  participationTimes: Number,
  createdAt: Date,
  modifiedAt: { type: Date, required: false },
});

const PlayerData = mongoose.model<IPlayerData>("playerData", playerDataSchema);

export { PlayerData };
