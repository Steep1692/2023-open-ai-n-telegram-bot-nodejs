import { ObjectId, WithId } from 'mongodb';

import { SEND_INTERVAL_DEFAULT } from './config';
import { initTelegramBot } from './telegram';
import {
  addRegisteredChatIDs,
  addWord,
  connectDataBase,
  createWordsCollection,
  deleteAllWords,
  deleteWord,
  getLastTimeSendByChatID,
  getRegisteredChatID,
  getRegisteredChats,
  getSendInterval,
  getWordsCollection,
  getWordToSend,
  LastTimeSend, makeAllWordsNotSend,
  RegisteredChat,
  SendInterval,
  updateLastTimeSendByChatID,
  updateSendInterval,
  updateWord,
  Word,
} from './database';
import { askOpenAI } from './open-ai';

const mapChatIDToTimerID: Record<number, NodeJS.Timer | undefined> = {};

const sendNextIfAvailable = async (chatID: number, sendTextMessage: (chatID: number, text: string) => Promise<void>): Promise<boolean> => {
  const wordToSend: WithId<Word> | null = await getWordToSend(chatID);

  if (wordToSend) {
    const total: number = await getWordsCollection(chatID).count()
    const sent: number = await getWordsCollection(chatID).count({ sent: true })

    await sendTextMessage(chatID, `${sent + 1}/${total} ${wordToSend.expression}`);

    const examplesResponse: string = await askOpenAI(`generate an example with a substring "${ wordToSend.expression }"`);
    await sendTextMessage(chatID, `Usage example:${ examplesResponse }`);

    const sendInterval: SendInterval | null = await getSendInterval(chatID);
    const timestampNextSend: number = Date.now() + (sendInterval?.interval || SEND_INTERVAL_DEFAULT)
    const dateNextSend: Date = new Date(timestampNextSend)
    await sendTextMessage(chatID, `Next expression at ${dateNextSend.getHours()}:${dateNextSend.getMinutes()}`);

    await updateWord(chatID, wordToSend._id, {
      sent: true,
    });
    await updateLastTimeSendByChatID(chatID, {
      timestamp: Date.now()
    });
    return true
  }

  return false
};

const startSendJobForChat = async (chatID: number, sendTextMessage: (chatID: number, text: string) => Promise<void>): Promise<void> => {
  const lastTimeSend: LastTimeSend | null = await getLastTimeSendByChatID(chatID);
  const sendInterval: SendInterval | null = await getSendInterval(chatID);

  const timestamp: number = Date.now();
  const timestampDelta: number = lastTimeSend
    ? (lastTimeSend.timestamp + (sendInterval?.interval ?? SEND_INTERVAL_DEFAULT)) - timestamp
    : 0;

  mapChatIDToTimerID[chatID] = setTimeout(async () => {
    const sent: boolean = await sendNextIfAvailable(chatID, sendTextMessage);

    if (sent) {
      await startSendJobForChat(chatID, sendTextMessage);
    }
  }, timestampDelta);
};

const restartSendJobForChat = async (chatID: number, sendTextMessage: (chatID: number, text: string) => Promise<void>): Promise<void> => {
  clearTimeout(mapChatIDToTimerID[chatID]);

  await startSendJobForChat(chatID, sendTextMessage);
};

const main = async () => {
  await connectDataBase();

  const { sendTextMessage } = initTelegramBot({
    isRegisteredChatID: async (chatID: number) => {
      return !!(await getRegisteredChatID(chatID)) && !!(await getWordsCollection(chatID));
    },

    onRegisterChatID: async (chatID: number) => {
      await addRegisteredChatIDs(chatID);
      await createWordsCollection(chatID);
    },
    onGetAllWords: async (chatID: number) => {
      return (await (await getWordsCollection(chatID).find()).toArray()).map(({ expression }, index) => {
        return (index + 1) + '. ' + expression;
      }).join('\n');
    },
    onMakeAllWordsUnsent: makeAllWordsNotSend,
    onUpdateInterval: (chatID: number, minutes: number) => {
      return updateSendInterval(chatID, {
        interval: minutes * 1000,
      });
    },
    onGetInfo: async (chatID: number): Promise<string> => {
      const total: number = await getWordsCollection(chatID).count()
      const sent: number = await getWordsCollection(chatID).count({ sent: true })
      const sendInterval: SendInterval | null = await getSendInterval(chatID);

      return `#Information\nSent: ${sent} expressions\nTotal: ${total} expressions\nInterval: ${Math.ceil((sendInterval?.interval || SEND_INTERVAL_DEFAULT) / 1000)} minutes`
    },

    onAddWord: async (chatID: number, message: string) => {
      const isSendAfterAdded: boolean = !await getWordsCollection(chatID).count({ sent: false });

      await addWord(chatID, message);

      if (isSendAfterAdded) {
        await restartSendJobForChat(chatID, sendTextMessage);
      }
    },
    onRemoveWord: (chatID: number, id: string) => deleteWord(chatID, id as unknown as ObjectId),
    onRemoveAllWords: deleteAllWords,
  });

  const registeredChatIDs: RegisteredChat[] = await (await (await getRegisteredChats()).find()).toArray();

  for (let i = 0; i < registeredChatIDs.length; i++) {
    await startSendJobForChat(registeredChatIDs[i].chatID, sendTextMessage);
  }
};

main();