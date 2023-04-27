import { Document } from 'mongodb'

export interface Word extends Document {
  expression: string
  sent: boolean
}

export interface SendInterval extends Document {
  interval: number
  chatID: number
}

export interface RegisteredChat extends Document {
  chatID: number
}

export interface LastTimeSend extends Document {
  timestamp: number
  chatID: number
}