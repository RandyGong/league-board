import * as mongoose from "mongoose";

export interface IGame extends mongoose.Document {
  title: string;
  date: {
    dateString: string;
    timeString: string;
    startTime: Date;
    endTime: Date;
  };
  type: "对内联赛" | "友谊赛" | "对抗赛";
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
  images: string[];
  participants: {
    confirmed: {
      noTeam: {
        openId: string;
        nickName: string;
        avatarUrl: string;
        isDelegate: boolean;
        participationTimes?: number;
        appliedAt: Date;
      }[];
      white: {
        openId: string;
        nickName: string;
        avatarUrl: string;
        isDelegate: boolean;
        participationTimes?: number;
        appliedAt: Date;
      }[];
      blue: {
        openId: string;
        nickName: string;
        avatarUrl: string;
        isDelegate: boolean;
        participationTimes?: number;
        appliedAt: Date;
      }[];
      red: {
        openId: string;
        nickName: string;
        avatarUrl: string;
        isDelegate: boolean;
        participationTimes?: number;
        appliedAt: Date;
      }[];
    };
    tbd: {
      openId: string;
      nickName: string;
      avatarUrl: string;
      isDelegate: boolean;
      reason: string;
      appliedAt: Date;
    }[];
    leave: {
      openId: string;
      nickName: string;
      avatarUrl: string;
      isDelegate: boolean;
      reason: string;
      appliedAt: Date;
    }[];
  };
  createdAt?: Date;
  modifiedAt?: Date;
}

export const gameSchema = new mongoose.Schema({
  title: String,
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
  images: [String],
  participants: {
    confirmed: {
      noTeam: [
        {
          openId: String,
          nickName: String,
          avatarUrl: String,
          isDelegate: Boolean,
          participationTimes: Number,
          appliedAt: Date,
        },
      ],
      white: [
        {
          openId: String,
          nickName: String,
          avatarUrl: String,
          isDelegate: Boolean,
          participationTimes: Number,
          appliedAt: Date,
        },
      ],
      blue: [
        {
          openId: String,
          nickName: String,
          avatarUrl: String,
          isDelegate: Boolean,
          participationTimes: Number,
          appliedAt: Date,
        },
      ],
      red: [
        {
          openId: String,
          nickName: String,
          avatarUrl: String,
          isDelegate: Boolean,
          participationTimes: Number,
          appliedAt: Date,
        },
      ],
    },
    tbd: [
      {
        openId: String,
        nickName: String,
        avatarUrl: String,
        isDelegate: Boolean,
        reason: String,
        appliedAt: Date,
      },
    ],
    leave: [
      {
        openId: String,
        nickName: String,
        avatarUrl: String,
        isDelegate: Boolean,
        reason: String,
        appliedAt: Date,
      },
    ],
  },
  createdAt: Date,
  modifiedAt: { type: Date, required: false },
});

const Game = mongoose.model<IGame>("game", gameSchema);

export { Game };
