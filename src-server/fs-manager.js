import {openFile, writeFile} from './utils/filesystem.js'
import {FILE_PATH_WORDS_ALL, FILE_PATH_WORDS_USED} from './utils/constants.js'


export const getAllItems = (defaultValue, parseToJSON = true) => {
  const file = openFile(FILE_PATH_WORDS_ALL, defaultValue)
  return file ? parseToJSON ? JSON.parse(file) : file : null
}

export const getItemsChecked = (defaultValue, parseToJSON = true) => {
  const file = openFile(FILE_PATH_WORDS_USED, defaultValue)
  return file ? parseToJSON ? JSON.parse(file) : file : null
}

export const getWordsUnused = () => {
  const wordsAll = getAllItems()
  const wordsUsed = getItemsChecked()
  return {
    wordsUnused: wordsUsed ? wordsAll.filter((w) => !wordsUsed.includes(w)) : wordsAll,
    wordsAll,
    wordsUsed,
  }
}

export const addWordToAllWords = (word) => {
  const value = getAllItems()
  const valueNew = value ? [...value, word] : [word]

  writeFile(FILE_PATH_WORDS_ALL, JSON.stringify(valueNew))
}

export const removeWordFromAllWords = (word) => {
  const value = getAllItems()
  const valueNew = value ? value.filter((w) => w !== word) : []

  writeFile(FILE_PATH_WORDS_ALL, JSON.stringify(valueNew))
}

export const addWordToUsedWords = (word) => {
  const value = getItemsChecked()
  const valueNew = value ? [...value, word] : [word]

  writeFile(FILE_PATH_WORDS_USED, JSON.stringify(valueNew))
}
