import './index.html'

import {
  wordsRequests,
  wordsList,
} from './words/index.js'
import { header } from './header/index.js'
import { initForm } from './form/index.js'

const addWord = async (word) => {
  try {
    await wordsRequests.addItem(word)

    header.increaseTotal()
    wordsList.add(word, false, () => removeWord(word))
  } catch (e) {
    alert(e)
  }
}

const removeWord = async (word) => {
  try {
    await wordsRequests.removeItem(word)

    const isUsed = wordsList.isUsed(word)

    if (isUsed) {
      header.decreaseUsed()
    }
    header.decreaseTotal()
    wordsList.remove(word)
  } catch (e) {
    alert(e)
  }
}

const handleClickRemoveItem = async (word) => {
  const accepted = confirm('Remove item ' + word + '?')

  if (accepted) {
    await removeWord(word)
  }
}

const mount = (words, wordsUsed) => {
  header.mount(wordsUsed.length, words.length)
  wordsList.mount(words, wordsUsed, handleClickRemoveItem)
}

const main = async () => {
  initForm((word) => addWord(word, false, handleClickRemoveItem))

  try {
    const words = await wordsRequests.getItems()
    const wordsUsed = await wordsRequests.getItemsChecked()

    mount(words, wordsUsed)
  } catch (e) {
    alert(e)
  }
}

main()