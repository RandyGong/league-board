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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueService = void 0;
var league_round_1 = require("../models/league.round");
var player_data_1 = require("../models/player.data");
var LeagueService = /** @class */ (function () {
    function LeagueService() {
    }
    LeagueService.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var leagueRounds, merged, playerData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, league_round_1.LeagueRound.find({}).sort({ roundNo: -1 })];
                    case 1:
                        leagueRounds = _a.sent();
                        merged = null;
                        if (leagueRounds && leagueRounds.length) {
                            merged = this.getMerged(leagueRounds);
                        }
                        return [4 /*yield*/, player_data_1.PlayerData.find({
                                nickName: { $exists: false },
                            }).sort({
                                goal: -1,
                            })];
                    case 2:
                        playerData = _a.sent();
                        return [2 /*return*/, {
                                merged: merged,
                                allRounds: leagueRounds,
                                playerData: playerData,
                            }];
                }
            });
        });
    };
    LeagueService.getMerged = function (leagueRounds) {
        var e_1, _a;
        var latestRound = leagueRounds[0];
        var merged = {
            till: "\u622A\u6B62".concat(latestRound.date, "\uFF0C\u7B2C").concat(latestRound.roundNo, "\u8F6E"),
            white: 0,
            blue: 0,
            red: 0,
            hasValue: true,
        };
        try {
            for (var leagueRounds_1 = __values(leagueRounds), leagueRounds_1_1 = leagueRounds_1.next(); !leagueRounds_1_1.done; leagueRounds_1_1 = leagueRounds_1.next()) {
                var round = leagueRounds_1_1.value;
                merged.white += round.white;
                merged.blue += round.blue;
                merged.red += round.red;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (leagueRounds_1_1 && !leagueRounds_1_1.done && (_a = leagueRounds_1.return)) _a.call(leagueRounds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return merged;
    };
    return LeagueService;
}());
exports.LeagueService = LeagueService;
//# sourceMappingURL=league.service.js.map