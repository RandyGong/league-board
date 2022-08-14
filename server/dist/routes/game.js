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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler_1 = require("../errorHandler");
var game_1 = require("../models/game");
var game_service_1 = require("../services/game.service");
var player_service_1 = require("../services/player.service");
var express = require("express");
var router = (0, errorHandler_1.toAsyncRouter)(express.Router());
router.get("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var allGames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, game_1.Game.find({}, "title date type aSide fee.randomMember location.name").sort({ "date.startTime": -1 })];
            case 1:
                allGames = _a.sent();
                if (allGames.length) {
                    if (allGames[0].date.endTime.getTime() > new Date().getTime()) {
                        allGames = allGames.slice(1);
                    }
                }
                res.send(allGames);
                return [2 /*return*/];
        }
    });
}); });
router.get("/:_id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, game_1.Game.findById(req.params._id)];
            case 1:
                game = _a.sent();
                res.send(game);
                return [2 /*return*/];
        }
    });
}); });
router.get("/current", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var latestGame, key;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, game_1.Game.findOne({}).sort({ "date.startTime": -1 })];
            case 1:
                latestGame = _b.sent();
                if (!latestGame) {
                    return [2 /*return*/, res.send(null)];
                }
                if (latestGame.date.endTime.getTime() > new Date().getTime()) {
                    // 考虑到由于比赛类型可能做过更改，修改前如果是对内联赛，那么按队伍报名的数据会丢失
                    // 这里把按对报名的人员都放到noTeam中
                    if (!!latestGame.modifiedAt && latestGame.type !== "对内联赛") {
                        for (key in latestGame.participants.confirmed) {
                            if (Object.prototype.hasOwnProperty.call(latestGame.participants.confirmed, key)) {
                                if (key !== "noTeam") {
                                    (_a = latestGame.participants.confirmed.noTeam).push.apply(_a, __spreadArray([], __read(latestGame.participants.confirmed[key]), false));
                                    latestGame.participants.confirmed[key] = [];
                                }
                            }
                        }
                    }
                    return [2 /*return*/, res.json(latestGame)];
                }
                res.send(null);
                return [2 /*return*/];
        }
    });
}); });
router.post("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                game = req.body;
                game.createdAt = new Date();
                return [4 /*yield*/, game_1.Game.insertMany([game])];
            case 1:
                _a.sent();
                res.end();
                return [2 /*return*/];
        }
    });
}); });
router.put("/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                game = req.body;
                game.modifiedAt = new Date();
                return [4 /*yield*/, game_1.Game.findByIdAndUpdate(req.params.id, game)];
            case 1:
                _a.sent();
                res.end();
                return [2 /*return*/];
        }
    });
}); });
router.delete("/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, game_1.Game.findByIdAndRemove(req.params.id)];
            case 1:
                _a.sent();
                res.end();
                return [2 /*return*/];
        }
    });
}); });
router.put("/:id/sign-off", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var participantObjectId, game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                participantObjectId = req.body._id;
                return [4 /*yield*/, game_1.Game.findById(req.params.id)];
            case 1:
                game = _a.sent();
                if (!game) {
                    throw new Error("未找到所指的的比赛!");
                }
                return [4 /*yield*/, game_service_1.GameService.moveOutFromConfirmed(game, participantObjectId, true)];
            case 2:
                _a.sent();
                game.participants.tbd = game.participants.tbd.filter(function (x) { return x["_id"].toString() !== participantObjectId; });
                game.participants.leave = game.participants.leave.filter(function (x) { return x["_id"].toString() !== participantObjectId; });
                return [4 /*yield*/, game.save()];
            case 3:
                _a.sent();
                res.end();
                return [2 /*return*/];
        }
    });
}); });
router.put("/:id/sign-up", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var command, game, dataToSave, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                command = req.body;
                return [4 /*yield*/, game_1.Game.findById(req.params.id)];
            case 1:
                game = _b.sent();
                if (!game) {
                    throw new Error("当前比赛未找到!");
                }
                dataToSave = {
                    openId: command.openId,
                    nickName: command.nickName,
                    avatarUrl: command.avatarUrl,
                    isDelegate: command.isDelegate,
                    reason: command.reason,
                    participationTimes: 1,
                    appliedAt: new Date(),
                };
                if (!(command.status === "confirmed")) return [3 /*break*/, 5];
                delete dataToSave.reason;
                if (!!command.isDelegate) return [3 /*break*/, 3];
                if (game_service_1.GameService.isRegisteredInGame(game, command.openId)) {
                    throw new Error("你已经报过名(或待定、请假)了，如需改变，请先取消报名");
                }
                _a = dataToSave;
                return [4 /*yield*/, player_service_1.PlayerService.updateParticipationTimes(command)];
            case 2:
                _a.participationTimes =
                    _b.sent();
                game.participants.confirmed[command.team].push(dataToSave);
                return [3 /*break*/, 4];
            case 3:
                delete dataToSave.participationTimes;
                game.participants.confirmed[command.team].push(dataToSave);
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                if (game_service_1.GameService.isRegisteredInGame(game, command.openId)) {
                    throw new Error("你已经报过名(或待定、请假)了，如需改变，请先取消报名");
                }
                delete dataToSave.isDelegate;
                delete dataToSave.participationTimes;
                game.participants[command.status].push(dataToSave);
                _b.label = 6;
            case 6: return [4 /*yield*/, game.save()];
            case 7:
                _b.sent();
                if (dataToSave.participationTimes) {
                    return [2 /*return*/, res.json({
                            participationTimes: dataToSave.participationTimes,
                        })];
                }
                res.end();
                return [2 /*return*/];
        }
    });
}); });
router.put("/:id/move-team", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, moveToTeam, participant, game;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, moveToTeam = _a.moveToTeam, participant = _a.participant;
                return [4 /*yield*/, game_1.Game.findById(req.params.id)];
            case 1:
                game = _b.sent();
                if (!game) {
                    throw new Error("未找到所指的的比赛!");
                }
                return [4 /*yield*/, game_service_1.GameService.moveOutFromConfirmed(game, participant._id, false)];
            case 2:
                _b.sent();
                if (!Object.prototype.hasOwnProperty.call(game.participants.confirmed, moveToTeam)) return [3 /*break*/, 4];
                if (game.participants.confirmed[moveToTeam].some(function (x) { return x._id.toString() === participant._id; })) {
                    throw new Error("\u8BE5\u7403\u5458\u5DF2\u7ECF\u5728".concat(game_service_1.GameService.getTeamNameByCode(moveToTeam), "\u4E86"));
                }
                // delete participant._id;
                game.participants.confirmed[moveToTeam].push(participant);
                return [4 /*yield*/, game.save()];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                res.end();
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;
//# sourceMappingURL=game.js.map