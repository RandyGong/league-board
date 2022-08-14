"use strict";
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
exports.toAsyncRouter = exports.asyncHandler = void 0;
var asyncHandler = function (fn) { return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(function (err) {
        res.status(500).send({ error: true, msg: err.message });
        next(err);
    });
}; };
exports.asyncHandler = asyncHandler;
var methods = [
    "get",
    "post",
    "put",
    "delete", // & etc.
];
function toAsyncRouter(router) {
    var _loop_1 = function (key) {
        if (methods.includes(key)) {
            var method_1 = router[key];
            router[key] = function (path) {
                var callbacks = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    callbacks[_i - 1] = arguments[_i];
                }
                return method_1.call.apply(method_1, __spreadArray([router, path], __read(callbacks.map(function (cb) { return (0, exports.asyncHandler)(cb); })), false));
            };
        }
    };
    for (var key in router) {
        _loop_1(key);
    }
    return router;
}
exports.toAsyncRouter = toAsyncRouter;
//# sourceMappingURL=errorHandler.js.map