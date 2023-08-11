import { createParser } from 'eventsource-parser';
import { isEmpty } from 'lodash';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var TIMEOUT = 10000;
function isValidJSON(data) {
    try {
        JSON.parse(data);
        return true;
    }
    catch (e) {
        return false;
    }
}
function streamRequest(response, controller, onText, onError, onStreamEnd) {
    return __awaiter(this, void 0, void 0, function () {
        var hasCancel, cancel, fullText, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hasCancel = false;
                    cancel = function () {
                        hasCancel = true;
                        controller.abort();
                    };
                    fullText = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handleSSE(response, function (message) {
                            var _a, _b;
                            var data = JSON.parse(message);
                            if (data.choices[0].finish_reason === 'stop') {
                                onStreamEnd === null || onStreamEnd === void 0 ? void 0 : onStreamEnd();
                                return;
                            }
                            if (data.error) {
                                throw new Error("Error from OpenAI: ".concat(JSON.stringify(data)));
                            }
                            var text = (_b = (_a = data.choices[0]) === null || _a === void 0 ? void 0 : _a.delta) === null || _b === void 0 ? void 0 : _b.content;
                            if (text !== undefined) {
                                fullText += text;
                                if (onText) {
                                    onText({ text: fullText, cancel: cancel });
                                }
                            }
                        }, onStreamEnd)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    // if a cancellation is performed
                    // do not throw an exception
                    // otherwise the content will be overwritten.
                    if (hasCancel) {
                        return [2 /*return*/];
                    }
                    if (onError) {
                        onError(error_1);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, fullText];
            }
        });
    });
}
function handleSSE(response, onMessage, onStreamEnd) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var error, parser, _d, _e, _f, chunk, str, strParse, e_1_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!!response.ok) return [3 /*break*/, 2];
                    return [4 /*yield*/, response.json().catch(function () { return null; })];
                case 1:
                    error = _g.sent();
                    throw new Error(error ? JSON.stringify(error) : "".concat(response.status, " ").concat(response.statusText));
                case 2:
                    if (response.status !== 200) {
                        throw new Error("Error from OpenAI: ".concat(response.status, " ").concat(response.statusText));
                    }
                    if (!response.body) {
                        throw new Error('No response body');
                    }
                    parser = createParser(function (event) {
                        if (event.type === 'event') {
                            onMessage(event.data);
                        }
                    });
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 8, 9, 14]);
                    _d = true, _e = __asyncValues(iterableStreamAsync(response.body, function () {
                        onStreamEnd === null || onStreamEnd === void 0 ? void 0 : onStreamEnd();
                    }));
                    _g.label = 4;
                case 4: return [4 /*yield*/, _e.next()];
                case 5:
                    if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3 /*break*/, 7];
                    _c = _f.value;
                    _d = false;
                    try {
                        chunk = _c;
                        str = new TextDecoder().decode(chunk, { stream: true });
                        if (isValidJSON(str)) {
                            strParse = JSON.parse(str);
                            if (!isEmpty(strParse.error)) {
                                throw str;
                            }
                        }
                        parser.feed(str);
                    }
                    finally {
                        _d = true;
                    }
                    _g.label = 6;
                case 6: return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _g.trys.push([9, , 12, 13]);
                    if (!(!_d && !_a && (_b = _e.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _b.call(_e)];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function iterableStreamAsync(stream, onTimeout) {
    return __asyncGenerator(this, arguments, function iterableStreamAsync_1() {
        var reader, resTimeoutId, _a, value, done;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reader = stream.getReader();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 9, 10]);
                    _b.label = 2;
                case 2:
                    resTimeoutId = setTimeout(function () {
                        onTimeout();
                    }, TIMEOUT);
                    return [4 /*yield*/, __await(reader.read())];
                case 3:
                    _a = _b.sent(), value = _a.value, done = _a.done;
                    clearTimeout(resTimeoutId);
                    if (!done) return [3 /*break*/, 5];
                    return [4 /*yield*/, __await(void 0)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, __await(value)];
                case 6: return [4 /*yield*/, _b.sent()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 2];
                case 8: return [3 /*break*/, 10];
                case 9:
                    reader.releaseLock();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}

export { TIMEOUT, handleSSE, isValidJSON, iterableStreamAsync, streamRequest };
