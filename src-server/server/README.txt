Node JS http server wrapper, that makes it easier to define
- middlewares
- routes

By default, includes
- a middleware,
    that parses URL parts
    and the result can be accessed via "req[PROPERTY_KEY_URL_PARSED]"
- a route "ANY",
    that is used to catch any route


Usage example:
const server = new Server(port, hostname); // creates a server instance

const middlewareParseReqBody = (req, res) => {
    // do middleware stuff
}

server.addMiddleware(middlewareParseReqBody); // adds a middleware

const handleStatic = (req, res) => {
    // do route handler stuff
}

server.addRoute(METHOD.get, ROUTE_ANY, handleStatic); // catches any GET route
