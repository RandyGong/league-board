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
exports.GameService = void 0;
var player_service_1 = require("./player.service");
var GameService = /** @class */ (function () {
    function GameService() {
    }
    GameService.isRegisteredInGame = function (game, openId) {
        var isAlreadyJoined = false;
        // 任意一队里有这个人，且不是代报名的，就不能再报了
        for (var key in game.participants.confirmed) {
            if (Object.prototype.hasOwnProperty.call(game.participants.confirmed, key)) {
                if (game.participants.confirmed[key].some(function (x) { return !x.isDelegate && x.openId === openId; })) {
                    isAlreadyJoined = true;
                }
            }
        }
        // 待定了或者请假了
        if (game.participants.tbd.some(function (x) { return x.openId === openId && !x.isDelegate; }) ||
            game.participants.leave.some(function (x) { return x.openId === openId && !x.isDelegate; })) {
            isAlreadyJoined = true;
        }
        return isAlreadyJoined;
    };
    GameService.signUpCommandToPlayerData = function (command) {
        return {
            openId: command.openId,
            name: "",
            nickName: command.nickName,
            avatarUrl: command.avatarUrl,
            goal: 0,
            assist: 0,
            participationTimes: 1,
            createdAt: new Date(),
        };
    };
    GameService.moveOutFromAllStatus = function (game, participantObjectId, isReduceParticipationTimes) {
        if (isReduceParticipationTimes === void 0) { isReduceParticipationTimes = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, key, data, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = [];
                        for (_b in game.participants.confirmed)
                            _a.push(_b);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        key = _a[_i];
                        if (!Object.prototype.hasOwnProperty.call(game.participants.confirmed, key)) return [3 /*break*/, 4];
                        if (!isReduceParticipationTimes) return [3 /*break*/, 3];
                        data = game.participants.confirmed[key].find(function (x) { return !x.isDelegate && x["_id"].toString() === participantObjectId; });
                        if (!data) return [3 /*break*/, 3];
                        _c = data;
                        return [4 /*yield*/, player_service_1.PlayerService.addParticipationTimes(data.openId, -1)];
                    case 2:
                        _c.participationTimes = _d.sent();
                        _d.label = 3;
                    case 3:
                        game.participants.confirmed[key] = game.participants.confirmed[key].filter(function (x) { return x["_id"].toString() !== participantObjectId; });
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        game.participants.tbd = game.participants.tbd.filter(function (x) { return x["_id"].toString() !== participantObjectId; });
                        game.participants.leave = game.participants.leave.filter(function (x) { return x["_id"].toString() !== participantObjectId; });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameService.getStatusOfParticipant = function (game, _id) {
        if (!game || !_id) {
            throw new Error("请检查参数");
        }
        for (var key in game.participants.confirmed) {
            if (Object.prototype.hasOwnProperty.call(game.participants.confirmed, key)) {
                if (game.participants.confirmed[key].some(function (x) { return x["_id"].toString() === _id; })) {
                    return "confirmed";
                }
            }
        }
        if (game.participants.tbd.some(function (x) { return x["_id"].toString() === _id; })) {
            return "tbd";
        }
        if (game.participants.leave.some(function (x) { return x["_id"].toString() === _id; })) {
            return "leave";
        }
        return null;
    };
    GameService.getTeamNameByCode = function (code) {
        var teams = {
            white: "白队",
            blue: "蓝队",
            red: "红队",
        };
        return teams[code];
    };
    GameService.getStatusNameByCode = function (code) {
        var teams = {
            confirmed: "已报名",
            tbd: "待定",
            leave: "请假",
        };
        return teams[code];
    };
    return GameService;
}());
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map