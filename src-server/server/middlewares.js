import url from 'url'
import { PROPERTY_KEY_URL_PARSED } from './constants.js'

export const middlewareParseReqURL = (req) => {
  req[PROPERTY_KEY_URL_PARSED] = url.parse(req.url, true)
}
