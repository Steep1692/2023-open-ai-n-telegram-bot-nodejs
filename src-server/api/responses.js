const sendError = (res, status, message = '') => {
  res.statusCode = status
  if (message) {
    res.setHeader('Content-Type', 'text/plain')
  }
  res.end(message)
}

const sendSuccess = (res, status, data = '', isJson) => {
  res.statusCode = status

  if (data) {
    if (isJson) {
      res.setHeader('Content-Type', 'application/json')
    } else {
      res.setHeader('Content-Type', 'text/plain')
    }
  }

  res.end(data)
}

export const sendNotFoundError = (res, message = '') => {
  sendError(res, 404, message)
}

export const sendBadRequestError = (res, message) => {
  sendError(res, 400, message)
}

export const sendNoContentSuccess = (res, message) => {
  sendSuccess(res, 204, message)
}

export const sendCreatedSuccess = (res, message) => {
  sendSuccess(res, 201, message)
}

export const sendJSONSuccess = (res, data) => {
  sendSuccess(res, 200, data, true)
};
