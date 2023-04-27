import { PROPERTY_KEY_BODY_PARSED } from '../middlewares.js'
import { SEARCH_PARAM } from '../../../shared/constants.js'
import { addWordToAllWords, getAllItems, getItemsChecked, removeWordFromAllWords } from '../../fs-manager.js'
import { logSuccess } from '../../utils/logger.js'
import { sendBadRequestError, sendCreatedSuccess, sendNoContentSuccess, sendJSONSuccess } from '../responses.js'

export const handleRouteGetItems = (req, res) => {
  sendJSONSuccess(res, getAllItems([], false))
}

export const handleRouteGetItemsChecked = (req, res) => {
  sendJSONSuccess(res, getItemsChecked([], false))
}

export const handleRouteAddItem = (req, res) => {
  const body = req[PROPERTY_KEY_BODY_PARSED]
  const word = body ? body[SEARCH_PARAM.word] : null

  if (word) {
    addWordToAllWords(word)

    logSuccess(Date.now(), 'Word added', {
      word,
    })

    sendCreatedSuccess(res, 'Word was successfully added')
  } else {
    sendBadRequestError(res, `Please, add a body parameter named ${SEARCH_PARAM.word} to the request`)
  }
}

export const handleRouteDeleteItem = (req, res) => {
  const body = req[PROPERTY_KEY_BODY_PARSED]
  const word = body ? body[SEARCH_PARAM.word] : null

  if (word) {
    removeWordFromAllWords(word)

    logSuccess(Date.now(), 'Word removed', {
      word,
    })

    sendNoContentSuccess(res, 'Word was successfully removed')
  } else {
    sendBadRequestError(res, `Please, add a body parameter named ${SEARCH_PARAM.word} to the request`)
  }
}
