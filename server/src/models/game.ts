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
  participants: {
    confirmed: {
      noTeam: {
        openId: string;
        nickName: string;
        avatarUrl: string;
        isDelegate: boolean;
      }[];
      white: {
        openId: string;
        nickName: string;
        avatarUrl: string;
        isDelegate: boolean;
      }[];
      blue: {
        openId: string;
        nickName: string;
        avatarUrl: string;
        isDelegate: boolean;
      }[];
      red: {
        openId: string;
        nickName: string;
        avatarUrl: string;
        isDelegate: boolean;
      }[];
    };
    tbd: {
      openId: string;
      nickName: string;
      avatarUrl: string;
      reason: string;
    }[];
    leave: {
      openId: string;
      nickName: string;
      avatarUrl: string;
      reason: string;
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
  participants: {
    confirmed: {
      noTeam: [
        {
          openId: String,
          nickName: String,
          avatarUrl: String,
          isDelegate: Boolean,
        },
      ],
      white: [
        {
          openId: String,
          nickName: String,
          avatarUrl: String,
          isDelegate: Boolean,
        },
      ],
      blue: [
        {
          openId: String,
          nickName: String,
          avatarUrl: String,
          isDelegate: Boolean,
        },
      ],
      red: [
        {
          openId: String,
          nickName: String,
          avatarUrl: String,
          isDelegate: Boolean,
        },
      ],
    },
    tbd: [
      {
        openId: String,
        nickName: String,
        avatarUrl: String,
        reason: String,
      },
    ],
    leave: [
      {
        openId: String,
        nickName: String,
        avatarUrl: String,
        reason: String,
      },
    ],
  },
  createdAt: Date,
  modifiedAt: { type: Date, required: false },
});

const Game = mongoose.model<IGame>("game", gameSchema);

export { Game };
