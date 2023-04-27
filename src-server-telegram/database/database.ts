import { Collection, DeleteResult, InsertOneResult, MongoClient, ObjectId, UpdateResult, WithId } from 'mongodb';
import { DATA_BASE_NAME, DATA_BASE_PASSWORD } from './config';
import { LastTimeSend, RegisteredChat, SendInterval, Word } from './types';
import { SEND_INTERVAL_DEFAULT } from '../config';

const uri = "mongodb+srv://shopen1692:6nO666lIddDYlQ0u@cluster0.nd8vdg9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const getDataBase = () => {
  return client.db(DATA_BASE_NAME)
}

export const getSendIntervals = (): Collection<SendInterval> => {
  return getDataBase().collection<SendInterval>('send-intervals')
}

export const getSendInterval = async (chatID: number): Promise<SendInterval | null> => {
  return (await getSendIntervals()).findOne({ chatID: { $eq: chatID } })
}

export const updateSendInterval = async (chatID: number, payload: Partial<SendInterval>): Promise<InsertOneResult | UpdateResult> => {
  const document: SendInterval | null = await getSendInterval(chatID)

  if (document) {
    return (await getSendIntervals()).updateOne({ chatID: { $eq: document.chatID } }, { $set: payload, })
  } else {
    return (await getSendIntervals()).insertOne({
      chatID,
      interval: SEND_INTERVAL_DEFAULT,
      ...payload,
    })
  }
}

export const getRegisteredChats = (): Collection<RegisteredChat> => {
  return getDataBase().collection<RegisteredChat>('registered-chat-ids')
}

export const getLastTimeSend = (): Collection<LastTimeSend> => {
  return getDataBase().collection<LastTimeSend>('last-time-send')
}

export const getLastTimeSendByChatID = async (chatID: number): Promise<WithId<LastTimeSend> | null> => {
  return (await getLastTimeSend()).findOne({ chatID: { $eq: chatID } })
}

export const updateLastTimeSendByChatID = async (chatID: number, payload: Partial<LastTimeSend>): Promise<InsertOneResult | UpdateResult> => {
  const document: WithId<LastTimeSend> | null = await getLastTimeSendByChatID(chatID)

  if (document) {
    return (await getLastTimeSend()).updateOne({ _id: document._id }, {
      $set: payload,
    })
  } else {
    return (await getLastTimeSend()).insertOne({
      chatID,
      timestamp: 0,
      ...payload,
    })
  }
}

export const addRegisteredChatIDs = async (chatID: number): Promise<InsertOneResult<RegisteredChat>> => {
  return (await getRegisteredChats()).insertOne({
    chatID,
  })
}

export const getRegisteredChatID = async (chatID: number): Promise<RegisteredChat | null> => {
  return (await getRegisteredChats()).findOne({
    chatID: {
      $eq: chatID,
    },
  })
}

export const createWordsCollection = (chatID) => {
  return client.db().createCollection<Word>('words-' + chatID)
}

export const getWordsCollection = (chatID: number):  Collection<Word> => {
  return getDataBase().collection<Word>('words-' + chatID)
}

export const getWordToSend = async (chatID: number): Promise<WithId<Word> | null> => {
  return (await getWordsCollection(chatID)).findOne({ sent: { $eq: false } })
}

export const makeAllWordsNotSend = async (chatID: number): Promise<UpdateResult> => {
  return (await getWordsCollection(chatID)).updateMany({ sent: { $eq: true } }, {
    $set: { sent: false }
  })
}

export const addWord = (chatID: number, expression: string):  Promise<InsertOneResult<Word>> => {
  return getWordsCollection(chatID).insertOne({
    expression,
    sent: false,
  })
}

export const updateWord = (chatID: number, id: ObjectId, payload: Partial<Word>):  Promise<UpdateResult> => {
  return getWordsCollection(chatID).updateOne({ _id: { $eq: id } }, { $set: payload })
}

export const deleteWord = (chatID: number, id: ObjectId):  Promise<DeleteResult> => {
  return getWordsCollection(chatID).deleteOne({ _id: { $eq: id } })
}

export const deleteAllWords = (chatID: number):  Promise<DeleteResult> => {
  return getWordsCollection(chatID).deleteMany()
}

export const disconnectDataBase = (): Promise<void> => {
  return client.close()
}

export const connectDataBase = (): Promise<MongoClient> => {
  return client.connect()
}