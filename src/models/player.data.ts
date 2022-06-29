import * as mongoose from "mongoose";

export interface IPlayerData extends mongoose.Document {
  name: string;
  goal: number;
  assist: number;
}

export const playerDataSchema = new mongoose.Schema({
  name: String,
  goal: Number,
  assist: Number,
});

const PlayerData = mongoose.model<IPlayerData>("playerData", playerDataSchema);

export { PlayerData };
