import path, { dirname } from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dirAssets = '../../assets/' // path is related to the current file directory
const dirLogs = '../../logs/' // path is related to the current file directory
const dirStatic = '../../dist/' // path is related to the current file directory

export const DIR_PATH_PUBLIC = path.join(__dirname, dirStatic)
export const FILE_PATH_VIEW_ADD = path.join(DIR_PATH_PUBLIC, '/index.html')


export const FILE_PATH_TIMESTAMPS_LAST_SEND = path.join(__dirname, dirAssets, '/date-last-send.json')

export const FILE_PATH_WORDS_ALL = path.join(__dirname, dirAssets, 'words.json')
export const FILE_PATH_WORDS_USED = path.join(__dirname, dirAssets, 'words.used.json')


export const FILE_PATH_SUCCESS_LOG = path.join(__dirname, dirLogs, 'success-log.json')
export const FILE_PATH_ERRORS_LOG = path.join(__dirname, dirLogs, 'errors-log.json')
