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
exports.initTelegramBot = void 0;
var TelegramBot = require("node-telegram-bot-api");
var config_1 = require("./config");
var database_1 = require("../database");
var mapChatIDToLastAction = {};
var cache_isRegisteredChatID = {};
var MessageCommands;
(function (MessageCommands) {
    MessageCommands["AddWord"] = "/addword";
    MessageCommands["RemoveWord"] = "/removeword";
    MessageCommands["ListWords"] = "/getwords";
    MessageCommands["RemoveWords"] = "/removewords";
    MessageCommands["AdjustInterval"] = "/setinterval";
    MessageCommands["MakeAllUnsent"] = "/makeallunsent";
})(MessageCommands || (MessageCommands = {}));
var deleteChatMessages = function (bot, chatID, lastMessageID) { return __awaiter(void 0, void 0, void 0, function () {
    var i, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < 12)) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, bot.deleteMessage(chatID, (lastMessageID - i).toString())];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                return [3 /*break*/, 6];
            case 5:
                i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Helper
var stringIsNumber = function (value) { return isNaN(Number(value)) === false; };
// Turn enum into array
function enumToArray(enumme) {
    return Object.keys(enumme)
        .filter(stringIsNumber)
        .map(function (key) { return enumme[key]; });
}
var isMessageTextAction = function (text) {
    return enumToArray(MessageCommands).includes(text);
};
var initTelegramBot = function (_a) {
    var isRegisteredChatID = _a.isRegisteredChatID, onRegisterChatID = _a.onRegisterChatID, onAddWord = _a.onAddWord, onRemoveWord = _a.onRemoveWord, onGetInfo = _a.onGetInfo, onRemoveAllWords = _a.onRemoveAllWords, onUpdateWord = _a.onUpdateWord, onGetAllWords = _a.onGetAllWords, onUpdateInterval = _a.onUpdateInterval;
    var bot = new TelegramBot(config_1.TELEGRAM_BOT_API_KEY, { polling: true });
    var sendMenu = function (chatID) { return __awaiter(void 0, void 0, void 0, function () {
        var info;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, onGetInfo(chatID)];
                case 1:
                    info = _a.sent();
                    bot.sendMessage(chatID, info, {
                        parse_mode: 'Markdown',
                        'reply_markup': {
                            'inline_keyboard': [
                                [
                                    {
                                        text: '1. Add',
                                        callback_data: MessageCommands.AddWord,
                                    },
                                    {
                                        text: '2. Remove',
                                        callback_data: MessageCommands.RemoveWord,
                                    },
                                    {
                                        text: '3. Show',
                                        callback_data: MessageCommands.ListWords,
                                    },
                                ],
                                [
                                    {
                                        text: 'Adjust Interval',
                                        callback_data: MessageCommands.AdjustInterval,
                                    },
                                ],
                                [
                                    {
                                        text: 'Make all unsent',
                                        callback_data: MessageCommands.MakeAllUnsent,
                                    },
                                ],
                            ]
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    bot.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
        var chatID, message, messageID, isRegistered, _a, isLastMessageWasAction, lastAction, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    chatID = msg.chat.id;
                    message = msg.text;
                    messageID = msg.message_id;
                    _a = cache_isRegisteredChatID[chatID];
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, isRegisteredChatID(chatID)];
                case 1:
                    _a = (_c.sent());
                    _c.label = 2;
                case 2:
                    isRegistered = _a;
                    if (!!isRegistered) return [3 /*break*/, 4];
                    return [4 /*yield*/, onRegisterChatID(chatID)];
                case 3:
                    _c.sent();
                    cache_isRegisteredChatID[chatID] = true;
                    bot.sendMessage(chatID, msg.chat.username + ', Weeelcome to "To Remember"!\n');
                    _c.label = 4;
                case 4:
                    isLastMessageWasAction = !!mapChatIDToLastAction[chatID];
                    if (!(!isMessageTextAction(message) && isLastMessageWasAction)) return [3 /*break*/, 11];
                    if (!message) {
                        bot.sendMessage(chatID, 'Please specify a command');
                        return [2 /*return*/];
                    }
                    lastAction = mapChatIDToLastAction[chatID];
                    _b = lastAction;
                    switch (_b) {
                        case MessageCommands.AddWord: return [3 /*break*/, 5];
                        case MessageCommands.AdjustInterval: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 5: return [4 /*yield*/, onAddWord(chatID, message)];
                case 6:
                    _c.sent();
                    bot.sendMessage(chatID, 'Expression added!');
                    return [3 /*break*/, 10];
                case 7: return [4 /*yield*/, onUpdateInterval(chatID, parseInt(message))];
                case 8:
                    _c.sent();
                    bot.sendMessage(chatID, 'Interval set. New interval is ' + message + ' minutes.');
                    return [3 /*break*/, 10];
                case 9:
                    {
                        bot.sendMessage(chatID, 'Unknown action!');
                        return [3 /*break*/, 10];
                    }
                    _c.label = 10;
                case 10:
                    mapChatIDToLastAction[chatID] = null;
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, deleteChatMessages(bot, chatID, messageID)];
                case 12:
                    _c.sent();
                    _c.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    }); });
    bot.on('callback_query', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
        var chatID, message, _a, words;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chatID = msg.message.chat.id;
                    message = msg.data;
                    _a = message;
                    switch (_a) {
                        case MessageCommands.AddWord: return [3 /*break*/, 1];
                        case MessageCommands.AdjustInterval: return [3 /*break*/, 2];
                        case MessageCommands.RemoveWords: return [3 /*break*/, 3];
                        case MessageCommands.ListWords: return [3 /*break*/, 5];
                        case MessageCommands.MakeAllUnsent: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 10];
                case 1:
                    {
                        bot.sendMessage(chatID, 'Specify a word:');
                        mapChatIDToLastAction[chatID] = MessageCommands.AddWord;
                        return [3 /*break*/, 11];
                    }
                    _b.label = 2;
                case 2:
                    {
                        bot.sendMessage(chatID, 'Specify an interval in minutes:');
                        mapChatIDToLastAction[chatID] = MessageCommands.AdjustInterval;
                        return [3 /*break*/, 11];
                    }
                    _b.label = 3;
                case 3: return [4 /*yield*/, onRemoveAllWords(chatID)];
                case 4:
                    _b.sent();
                    bot.sendMessage(chatID, 'Words removed');
                    return [3 /*break*/, 11];
                case 5: return [4 /*yield*/, onGetAllWords(chatID)];
                case 6:
                    words = _b.sent();
                    bot.sendMessage(chatID, 'Expressions: \n' + words);
                    return [3 /*break*/, 11];
                case 7: return [4 /*yield*/, (0, database_1.makeAllWordsNotSend)(chatID)];
                case 8:
                    _b.sent();
                    bot.sendMessage(chatID, 'All words were made unsent!');
                    return [4 /*yield*/, sendMenu(chatID)];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 10:
                    {
                        bot.sendMessage(chatID, 'Please, choose a command from Commands Menu!');
                    }
                    _b.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    }); });
    return {
        sendTextMessage: function (chatID, text) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bot.sendMessage(chatID, text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }
    };
};
exports.initTelegramBot = initTelegramBot;
