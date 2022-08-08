"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueRound = exports.leagueRoundSchema = void 0;
var mongoose = require("mongoose");
exports.leagueRoundSchema = new mongoose.Schema({
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
var LeagueRound = mongoose.model("leagueRound", exports.leagueRoundSchema);
exports.LeagueRound = LeagueRound;
//# sourceMappingURL=league.round.js.map