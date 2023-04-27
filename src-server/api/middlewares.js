export const PROPERTY_KEY_BODY_PARSED = 'body'

export const middlewareParseReqBody = (req) => {
  if (req.method === 'POST' || req.method === 'DELETE') {
    return new Promise((resolve, reject) => {
      let body = ''

      req.on('data', (data) => {
        body += data

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) {
          req.connection.destroy()
        }
      })

      req.on('error', reject)

      req.on('end', () => {
        req[PROPERTY_KEY_BODY_PARSED] = JSON.parse(body)
        resolve()
      })
    })
  }

  return true
}
