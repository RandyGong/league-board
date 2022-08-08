import * as mongoose from "mongoose";

export interface ILeagueRound extends mongoose.Document {
  date: string;
  roundNo: number;
  // team: string;
  // score: number;
  white: number;
  blue: number;
  red: number;
  createdAt?: Date;
  modifiedAt?: Date;
}

export const leagueRoundSchema = new mongoose.Schema({
  date: String,
  roundNo: Number,
  // team: String,
  // score: Number,
  white: Number,
  blue: Number,
  red: Number,
  createdAt: Date,
  modifiedAt: { type: Date, required: false },
});

const LeagueRound = mongoose.model<ILeagueRound>(
  "leagueRound",
  leagueRoundSchema
);

export { LeagueRound };
