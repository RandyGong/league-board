"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler_1 = require("../errorHandler");
var league_round_1 = require("../models/league.round");
var league_service_1 = require("../services/league.service");
var express = require("express");
var router = (0, errorHandler_1.toAsyncRouter)(express.Router());
/* GET league listing. */
router.get("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var leagueRound;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, league_round_1.LeagueRound.find({}).sort({ roundNo: -1 })];
            case 1:
                leagueRound = _a.sent();
                res.send(leagueRound);
                return [2 /*return*/];
        }
    });
}); });
router.get("/all", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var all;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, league_service_1.LeagueService.getAll()];
            case 1:
                all = _a.sent();
                res.send(all);
                return [2 /*return*/];
        }
    });
}); });
router.get("/merged", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var leagueRounds, merged;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, league_round_1.LeagueRound.find({}).sort({ roundNo: -1 })];
            case 1:
                leagueRounds = _a.sent();
                if (!leagueRounds.length)
                    return [2 /*return*/, res.send({ hasValue: false })];
                merged = league_service_1.LeagueService.getMerged(leagueRounds);
                res.send(merged);
                return [2 /*return*/];
        }
    });
}); });
router.post("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var round, isExistCount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                round = req.body;
                return [4 /*yield*/, league_round_1.LeagueRound.count({
                        $or: [{ date: round.date }, { roundNo: round.roundNo }],
                    })];
            case 1:
                isExistCount = _a.sent();
                if (isExistCount > 0) {
                    res.json({
                        error: true,
                        msg: "当天(或当轮)的比赛数据已存在！",
                    });
                    return [2 /*return*/];
                }
                round.createdAt = new Date();
                return [4 /*yield*/, league_round_1.LeagueRound.insertMany([round])];
            case 2:
                _a.sent();
                // const scoringArray: ILeagueRound[] = [];
                // for (let score of round.scoring) {
                //   const roundByTeam = {
                //     date: round.date,
                //     roundNo: round.roundNo,
                //     team: score.team,
                //     score: score.score,
                //     createdAt: new Date(),
                //   } as ILeagueRound;
                //   scoringArray.push(roundByTeam);
                // }
                // await LeagueRound.insertMany(scoringArray);
                res.end();
                return [2 /*return*/];
        }
    });
}); });
router.put("/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, command, existRounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                command = req.body;
                return [4 /*yield*/, league_round_1.LeagueRound.find({
                        $or: [{ date: command.date }, { roundNo: command.roundNo }],
                    })];
            case 1:
                existRounds = _a.sent();
                if (existRounds.length &&
                    existRounds.filter(function (x) { return x._id.toString() !== id; }).length > 0) {
                    res.json({
                        error: true,
                        msg: "当天(或当轮)的比赛数据已存在！",
                    });
                    return [2 /*return*/];
                }
                command.modifiedAt = new Date();
                return [4 /*yield*/, league_round_1.LeagueRound.findByIdAndUpdate(id, command)];
            case 2:
                _a.sent();
                res.end();
                return [2 /*return*/];
        }
    });
}); });
router.delete("/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, league_round_1.LeagueRound.findByIdAndRemove(id)];
            case 1:
                _a.sent();
                res.end();
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;
//# sourceMappingURL=league.js.map