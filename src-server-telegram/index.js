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
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var telegram_1 = require("./telegram");
var database_1 = require("./database");
var open_ai_1 = require("./open-ai");
var mapChatIDToTimerID = {};
var sendNextIfAvailable = function (chatID, sendTextMessage) { return __awaiter(void 0, void 0, void 0, function () {
    var wordToSend, total, sent, examplesResponse, sendInterval, timestampNextSend, dateNextSend;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.getWordToSend)(chatID)];
            case 1:
                wordToSend = _a.sent();
                if (!wordToSend) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, database_1.getWordsCollection)(chatID).count()];
            case 2:
                total = _a.sent();
                return [4 /*yield*/, (0, database_1.getWordsCollection)(chatID).count({ sent: true })];
            case 3:
                sent = _a.sent();
                return [4 /*yield*/, sendTextMessage(chatID, "".concat(sent + 1, "/").concat(total, " ").concat(wordToSend.expression))];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, open_ai_1.askOpenAI)("generate an example with a substring \"".concat(wordToSend.expression, "\""))];
            case 5:
                examplesResponse = _a.sent();
                return [4 /*yield*/, sendTextMessage(chatID, "Usage example:".concat(examplesResponse))];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, database_1.getSendInterval)(chatID)];
            case 7:
                sendInterval = _a.sent();
                timestampNextSend = Date.now() + ((sendInterval === null || sendInterval === void 0 ? void 0 : sendInterval.interval) || config_1.SEND_INTERVAL_DEFAULT);
                dateNextSend = new Date(timestampNextSend);
                return [4 /*yield*/, sendTextMessage(chatID, "Next expression at ".concat(dateNextSend.getHours(), ":").concat(dateNextSend.getMinutes()))];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, database_1.updateWord)(chatID, wordToSend._id, {
                        sent: true,
                    })];
            case 9:
                _a.sent();
                return [4 /*yield*/, (0, database_1.updateLastTimeSendByChatID)(chatID, {
                        timestamp: Date.now()
                    })];
            case 10:
                _a.sent();
                return [2 /*return*/, true];
            case 11: return [2 /*return*/, false];
        }
    });
}); };
var startSendJobForChat = function (chatID, sendTextMessage) { return __awaiter(void 0, void 0, void 0, function () {
    var lastTimeSend, sendInterval, timestamp, timestampDelta;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, database_1.getLastTimeSendByChatID)(chatID)];
            case 1:
                lastTimeSend = _b.sent();
                return [4 /*yield*/, (0, database_1.getSendInterval)(chatID)];
            case 2:
                sendInterval = _b.sent();
                timestamp = Date.now();
                timestampDelta = lastTimeSend
                    ? (lastTimeSend.timestamp + ((_a = sendInterval === null || sendInterval === void 0 ? void 0 : sendInterval.interval) !== null && _a !== void 0 ? _a : config_1.SEND_INTERVAL_DEFAULT)) - timestamp
                    : 0;
                mapChatIDToTimerID[chatID] = setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, sendNextIfAvailable(chatID, sendTextMessage)];
                            case 1:
                                sent = _a.sent();
                                if (!sent) return [3 /*break*/, 3];
                                return [4 /*yield*/, startSendJobForChat(chatID, sendTextMessage)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, timestampDelta);
                return [2 /*return*/];
        }
    });
}); };
var restartSendJobForChat = function (chatID, sendTextMessage) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clearTimeout(mapChatIDToTimerID[chatID]);
                return [4 /*yield*/, startSendJobForChat(chatID, sendTextMessage)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sendTextMessage, registeredChatIDs, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.connectDataBase)()];
            case 1:
                _a.sent();
                sendTextMessage = (0, telegram_1.initTelegramBot)({
                    isRegisteredChatID: function (chatID) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, database_1.getRegisteredChatID)(chatID)];
                                case 1:
                                    _a = !!(_b.sent());
                                    if (!_a) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, database_1.getWordsCollection)(chatID)];
                                case 2:
                                    _a = !!(_b.sent());
                                    _b.label = 3;
                                case 3: return [2 /*return*/, _a];
                            }
                        });
                    }); },
                    onRegisterChatID: function (chatID) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, database_1.addRegisteredChatIDs)(chatID)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, database_1.createWordsCollection)(chatID)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                    onGetAllWords: function (chatID) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, database_1.getWordsCollection)(chatID).find()];
                                case 1: return [4 /*yield*/, (_a.sent()).toArray()];
                                case 2: return [2 /*return*/, (_a.sent()).map(function (_a, index) {
                                        var expression = _a.expression;
                                        return (index + 1) + '. ' + expression;
                                    }).join('\n')];
                            }
                        });
                    }); },
                    onMakeAllWordsUnsent: database_1.makeAllWordsNotSend,
                    onUpdateInterval: function (chatID, minutes) {
                        return (0, database_1.updateSendInterval)(chatID, {
                            interval: minutes * 1000,
                        });
                    },
                    onGetInfo: function (chatID) { return __awaiter(void 0, void 0, void 0, function () {
                        var total, sent, sendInterval;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, database_1.getWordsCollection)(chatID).count()];
                                case 1:
                                    total = _a.sent();
                                    return [4 /*yield*/, (0, database_1.getWordsCollection)(chatID).count({ sent: true })];
                                case 2:
                                    sent = _a.sent();
                                    return [4 /*yield*/, (0, database_1.getSendInterval)(chatID)];
                                case 3:
                                    sendInterval = _a.sent();
                                    return [2 /*return*/, "#Information\nSent: ".concat(sent, " expressions\nTotal: ").concat(total, " expressions\nInterval: ").concat(Math.ceil((sendInterval.interval || config_1.SEND_INTERVAL_DEFAULT) / 1000), " minutes")];
                            }
                        });
                    }); },
                    onAddWord: function (chatID, message) { return __awaiter(void 0, void 0, void 0, function () {
                        var isSendAfterAdded;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, database_1.getWordsCollection)(chatID).count({ sent: false })];
                                case 1:
                                    isSendAfterAdded = !(_a.sent());
                                    return [4 /*yield*/, (0, database_1.addWord)(chatID, message)];
                                case 2:
                                    _a.sent();
                                    if (!isSendAfterAdded) return [3 /*break*/, 4];
                                    return [4 /*yield*/, restartSendJobForChat(chatID, sendTextMessage)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); },
                    onRemoveWord: function (chatID, id) { return (0, database_1.deleteWord)(chatID, id); },
                    onRemoveAllWords: database_1.deleteAllWords,
                }).sendTextMessage;
                return [4 /*yield*/, (0, database_1.getRegisteredChats)()];
            case 2: return [4 /*yield*/, (_a.sent()).find()];
            case 3: return [4 /*yield*/, (_a.sent()).toArray()];
            case 4:
                registeredChatIDs = _a.sent();
                i = 0;
                _a.label = 5;
            case 5:
                if (!(i < registeredChatIDs.length)) return [3 /*break*/, 8];
                return [4 /*yield*/, startSendJobForChat(registeredChatIDs[i].chatID, sendTextMessage)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/];
        }
    });
}); };
main();
