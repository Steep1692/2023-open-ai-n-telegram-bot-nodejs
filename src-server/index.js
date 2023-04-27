import { startAPI } from './api/api.js'
import { startSendingWords } from './push-notification-manager.js'
import { API_HOSTNAME, API_PORT, APP_TOKEN, SEND_DELAY, USER_KEY } from '../config/index.js'

const [, path, delay, port, hostname] = process.argv

startSendingWords({
  appToken: APP_TOKEN,
  userKey: USER_KEY,
  delay: delay ?? SEND_DELAY,
})

startAPI(port ?? API_PORT, hostname ?? API_HOSTNAME);