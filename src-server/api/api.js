import Server from '../server/server.js'
import { METHOD, ROUTE_ANY } from '../server/constants.js'
import { middlewareParseReqBody } from './middlewares.js'
import { ROUTE } from '../../shared/constants.js'
import {
  handleRouteAddItem,
  handleRouteDeleteItem,
  handleRouteGetItems,
  handleRouteGetItemsChecked
} from './words/api.js'
import { handleRouteStatic } from './static/api.js'

export const startAPI = (port, hostname) => {
  const server = new Server(port, hostname);
  server.addMiddleware(middlewareParseReqBody);

  server.addRoute(METHOD.get, ROUTE.items, handleRouteGetItems);
  server.addRoute(METHOD.get, ROUTE.itemsChecked, handleRouteGetItemsChecked);

  server.addRoute(METHOD.post, ROUTE.item, handleRouteAddItem);
  server.addRoute(METHOD.delete, ROUTE.item, handleRouteDeleteItem);

  server.addRoute(METHOD.get, ROUTE_ANY, handleRouteStatic);
};
