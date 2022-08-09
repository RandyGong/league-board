"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerData = exports.matchSchema = void 0;
var mongoose = require("mongoose");
exports.matchSchema = new mongoose.Schema({
    title: String,
    goal: Number,
    assist: Number,
    createdAt: Date,
    modifiedAt: { type: Date, required: false },
});
var PlayerData = mongoose.model("playerData", playerDataSchema);
exports.PlayerData = PlayerData;
//# sourceMappingURL=match.js.map