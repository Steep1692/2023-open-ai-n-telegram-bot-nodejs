import http from 'http'
import { sendNotFoundError } from '../api/responses.js'
import { PROPERTY_KEY_URL_PARSED, ROUTE_ANY } from './constants.js'
import { middlewareParseReqURL} from './middlewares.js'

const handleRoute = (req, res, method, url, handler) => {
  const pathname = req[PROPERTY_KEY_URL_PARSED].pathname

  if ((url === ROUTE_ANY || pathname === url) && req.method === method) {
    handler(req, res)
    return true
  }

  return false
}

class Server {
  server
  middlewares = [
    middlewareParseReqURL,
  ]
  routes

  constructor(port, hostname) {
    this.server = http.createServer(async (req, res) => {
      for (const middleware of this.middlewares) {
        await middleware(req, res)
      }

      let reqHandled
      for (const { method, url, handler } of this.routes) {
        reqHandled = handleRoute(req, res, method, url, handler)

        if (reqHandled) {
          break
        }
      }

      if (!reqHandled) {
        sendNotFoundError(res, `There is no such route named "${req.url}" =<\nTry one of this routes: ${this.routes.map((r) => {
          return r.method + ': ' + r.url
        })}`)
      }
    })

    this.server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`)
    })
  }


  addMiddleware(middleware) {
    if (this.middlewares) {
      this.middlewares.push(middleware)
    } else {
      this.middlewares = [middleware]
    }
  }

  addRoute(method, url, handler) {
    const route = {
      method,
      url,
      handler,
    }

    if (this.routes) {
      this.routes.push(route)
    } else {
      this.routes = [route]
    }
  }
}

export default Server
