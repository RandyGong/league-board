import * as mongoose from "mongoose";
import { IPlayerData } from "./player.data";

export interface IGame extends mongoose.Document {
  name: string;
  date: {
    dateString: string;
    timeString: string;
    startTime: Date;
    endTime: Date;
  };
  type: string;
  aSide: string;
  plannedNumberOfPeople: string;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    district: string;
    province: string;
  };
  fee: {
    fixedMember: string;
    randomMember: string;
  };
  note: string;
  participants: {
    confirmed: {
      playerId: {
        type: mongoose.Schema.Types.ObjectId;
        ref: "playerData";
      };
    }[];
    tbd: {
      playerId: {
        type: mongoose.Schema.Types.ObjectId;
        ref: "playerData";
      };
      reason: string;
    }[];
    leave: {
      playerId: {
        type: mongoose.Schema.Types.ObjectId;
        ref: "playerData";
      };
      reason: string;
    }[];
  }[];
  createdAt?: Date;
  modifiedAt?: Date;
}

export const gameSchema = new mongoose.Schema({
  name: String,
  date: {
    dateString: String,
    timeString: String,
    startTime: Date,
    endTime: Date,
  },
  type: String,
  aSide: String,
  plannedNumberOfPeople: String,
  location: {
    name: String,
    address: String,
    latitude: Number,
    longitude: Number,
    city: String,
    district: String,
    province: String,
  },
  fee: {
    fixedMember: String,
    randomMember: String,
  },
  note: String,
  participants: [
    {
      confirmed: [
        {
          playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "playerData",
          },
        },
      ],
      tbd: [
        {
          playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "playerData",
          },
          reason: String,
        },
      ],
      leave: [
        {
          playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "playerData",
          },
          reason: String,
        },
      ],
    },
  ],
  createdAt: Date,
  modifiedAt: { type: Date, required: false },
});

const Game = mongoose.model<IGame>("game", gameSchema);

export { Game };
