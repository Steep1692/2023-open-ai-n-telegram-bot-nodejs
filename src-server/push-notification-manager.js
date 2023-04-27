import Pushover from 'node-pushover'

import {getRandomEmoji} from './utils/emojis.js'
import {addWordToUsedWords, getWordsUnused} from './fs-manager.js'
import {logError, logSuccess} from './utils/logger.js'
import { openFile, writeFile } from './utils/filesystem.js'
import { FILE_PATH_TIMESTAMPS_LAST_SEND } from './utils/constants.js'

class PushNotificationManager {
  manager = null

  constructor(appToken, userKey) {
    this.manager = new Pushover({
      token: appToken,
      user: userKey,
    })
  }

  sendWord(word, number, total) {
    return new Promise((resolve, reject) => {
      this.manager.send(`Word ${number}/${total} ${getRandomEmoji()}`, word, function (err) {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  async sendFirstUnusedWord() {
    const {wordsUnused, wordsUsed, wordsAll} = getWordsUnused()
    const word = wordsUnused[0] ?? "Please, add words."

    try {
      await this.sendWord(word, wordsUsed ? wordsUsed.length + 1 : 1, wordsAll.length)

      addWordToUsedWords(word)

      logSuccess(Date.now(), 'Word sent', {
        word,
      })
    } catch (e) {
      logError(Date.now(), e.toString(), {
        word,
      })
    }
  }
}

export const startSendingWords = ({appToken, userKey, delay}) => {
  const pushNotificationsManager = new PushNotificationManager(appToken, userKey)

  const sendWordAndStartTimeout = () => {
    pushNotificationsManager.sendFirstUnusedWord().then(() => {
      writeFile(FILE_PATH_TIMESTAMPS_LAST_SEND, Date.now().toString())

      setTimeout(sendWordAndStartTimeout, delay)
    })
  }

  const timestamp = openFile(FILE_PATH_TIMESTAMPS_LAST_SEND)

  const timeout = timestamp
    ? Math.max(0, (parseInt(timestamp) + delay) - Date.now())
    : 0;

  setTimeout(sendWordAndStartTimeout, timeout)
}
