import TelegramBot = require('node-telegram-bot-api');
import { TELEGRAM_BOT_API_KEY } from './config';
import { makeAllWordsNotSend } from '../database';

const mapChatIDToLastAction: Record<number, MessageCommands | null> = {};

const cache_isRegisteredChatID: Record<number, boolean> = {};

enum MessageCommands {
  AddWord = '/addword', // Add expression
  RemoveWord = '/removeword', // Remove expression
  ListWords = '/getwords', // Show expressions list
  RemoveWords = '/removewords', // Remove all words
  AdjustInterval = '/setinterval', // Set sending interval
  MakeAllUnsent = '/makeallunsent',
}

type Options = {
  isRegisteredChatID: (chatID: number) => Promise<boolean>
  onRegisterChatID: (chatID: number) => Promise<any>
  onGetInfo: (chatID: number) => Promise<string>
  onUpdateInterval: (chatID: number, minutes: number) => Promise<any>
  onMakeAllWordsUnsent: (chatID: number) => Promise<any>
  onAddWord: (chatID: number, expression: string) => Promise<any>
  onRemoveWord?: (chatID: number, id: string) => Promise<any>
  onRemoveAllWords: (chatID: number) => Promise<any>
  onUpdateWord?: (chatID: number, id: string, expression: string) => Promise<void>
  onGetAllWords: (chatID: number) => Promise<string>
}

type TelegramBotInterface = {
  sendTextMessage: (chatID: number, text: string) => Promise<void>
}

const deleteChatMessages = async (bot: TelegramBot, chatID: number, lastMessageID: number): Promise<void> => {
  for (let i = 0; i < 12; i++) {
    try {
      await bot.deleteMessage(chatID, (lastMessageID - i).toString());
    } catch (e) {
      break;
    }
  }
};

// Helper
const stringIsNumber = value => isNaN(Number(value)) === false;

// Turn enum into array
function enumToArray(enumme) {
  return Object.keys(enumme)
    .filter(stringIsNumber)
    .map(key => enumme[key]);
}

const isMessageTextAction = (text: string): boolean => {
  return enumToArray(MessageCommands).includes(text);
};

export const initTelegramBot = ({
                                  isRegisteredChatID,
                                  onRegisterChatID,
                                  onAddWord,
                                  onRemoveWord,
                                  onGetInfo,
                                  onRemoveAllWords,
                                  onUpdateWord,
                                  onGetAllWords,
                                  onUpdateInterval,
                                }: Options): TelegramBotInterface => {
  const bot = new TelegramBot(TELEGRAM_BOT_API_KEY, { polling: true });

  const sendMenu = async (chatID: number) => {
    const info: string = await onGetInfo(chatID);

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
  }

  bot.on('message', async (msg) => {
    const chatID: number = msg.chat.id;
    const message: string | undefined = msg.text;
    const messageID: number = msg.message_id;

    // ======== Register Chat if needed ========
    const isRegistered: boolean = cache_isRegisteredChatID[chatID] || await isRegisteredChatID(chatID);

    if (!isRegistered) {
      await onRegisterChatID(chatID);

      cache_isRegisteredChatID[chatID] = true;

      bot.sendMessage(chatID, msg.chat.username + ', Weeelcome to "To Remember"!\n');
    }
    // =========================================

    const isLastMessageWasAction: boolean = !!mapChatIDToLastAction[chatID];

    if (!isMessageTextAction(message) && isLastMessageWasAction) {
      if (!message) {
        bot.sendMessage(chatID, 'Please specify a command');
        return;
      }

      const lastAction: MessageCommands | undefined = mapChatIDToLastAction[chatID];

      switch (lastAction) {
        case MessageCommands.AddWord: {
          await onAddWord(chatID, message);
          bot.sendMessage(chatID, 'Expression added!');
          break;
        }
        case MessageCommands.AdjustInterval: {
          await onUpdateInterval(chatID, parseInt(message));
          bot.sendMessage(chatID, 'Interval set. New interval is ' + message + ' minutes.');
          break;
        }
        default: {
          bot.sendMessage(chatID, 'Unknown action!');
          break;
        }
      }

      mapChatIDToLastAction[chatID] = null;
    } else {
      await deleteChatMessages(bot, chatID, messageID);


    }
  });

  bot.on('callback_query', async (msg) => {
    const chatID: number = msg.message.chat.id;
    const message: string | undefined = msg.data;

    switch (message) {
      case MessageCommands.AddWord: {
        bot.sendMessage(chatID, 'Specify a word:');
        mapChatIDToLastAction[chatID] = MessageCommands.AddWord;
        break;
      }
      case MessageCommands.AdjustInterval: {
        bot.sendMessage(chatID, 'Specify an interval in minutes:');
        mapChatIDToLastAction[chatID] = MessageCommands.AdjustInterval;
        break;
      }
      case MessageCommands.RemoveWords: {
        await onRemoveAllWords(chatID);
        bot.sendMessage(chatID, 'Words removed');
        break;
      }
      case MessageCommands.ListWords: {
        const words: string = await onGetAllWords(chatID);
        bot.sendMessage(chatID, 'Expressions: \n' + words);
        break;
      }
      case MessageCommands.MakeAllUnsent: {
        await makeAllWordsNotSend(chatID);
        bot.sendMessage(chatID, 'All words were made unsent!');
        await sendMenu(chatID)
        break;
      }
      default: {
        bot.sendMessage(chatID, 'Please, choose a command from Commands Menu!');
      }
    }
  });

  return {
    sendTextMessage: async (chatID: number, text: string) => {
      await bot.sendMessage(chatID, text);
    }
  };
};

