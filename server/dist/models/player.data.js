"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerData = exports.playerDataSchema = void 0;
var mongoose = require("mongoose");
exports.playerDataSchema = new mongoose.Schema({
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
var PlayerData = mongoose.model("playerData", exports.playerDataSchema);
exports.PlayerData = PlayerData;
//# sourceMappingURL=player.data.js.map