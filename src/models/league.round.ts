import * as mongoose from "mongoose";

export interface ILeagueRound extends mongoose.Document {
  date: string;
  team: string;
  score: number;
  createdAt?: Date;
  modifiedAt?: Date;
}

export const leagueRoundSchema = new mongoose.Schema({
  date: String,
  team: String,
  score: Number,
  createdAt: Date,
  modifiedAt: { type: Date, required: false },
});

const LeagueRound = mongoose.model<ILeagueRound>(
  "leagueRound",
  leagueRoundSchema
);

export { LeagueRound };
