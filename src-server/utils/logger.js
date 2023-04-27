import {FILE_PATH_ERRORS_LOG, FILE_PATH_SUCCESS_LOG, FILE_PATH_WORDS_USED} from './constants.js'
import {openFile, writeFile} from './filesystem.js'

export const logError = (timestamp, message, data) => {
  const valueCurrent = openFile(FILE_PATH_ERRORS_LOG);

  const log = {
    timestamp,
    message,
    data,
  };

  const valueNew = valueCurrent ? [...JSON.parse(valueCurrent), log] : [log];

  writeFile(FILE_PATH_ERRORS_LOG, JSON.stringify(valueNew));

  console.error("Logger. Error: ", log)
};

export const logSuccess = (timestamp, message, data) => {
  const valueCurrent = openFile(FILE_PATH_SUCCESS_LOG);

  const log = {
    timestamp,
    message,
    data,
  };

  const valueNew = valueCurrent ? [...JSON.parse(valueCurrent), log] : [log];

  writeFile(FILE_PATH_SUCCESS_LOG, JSON.stringify(valueNew));

  console.log("Logger. Success: ", log)
};
