"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.gameSchema = void 0;
var mongoose = require("mongoose");
exports.gameSchema = new mongoose.Schema({
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
var Game = mongoose.model("game", exports.gameSchema);
exports.Game = Game;
//# sourceMappingURL=game.js.map