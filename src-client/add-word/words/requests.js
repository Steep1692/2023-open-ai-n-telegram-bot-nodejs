import { ROUTE, SEARCH_PARAM } from '../../../shared/constants.js'

export const addItem = async (item) => {
  const response = await fetch(`${ROUTE.item}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      [SEARCH_PARAM.word]: item,
    })
  })
  return await response.text()
}

export const removeItem = async (item) => {
  const response = await fetch(`${ROUTE.item}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      [SEARCH_PARAM.word]: item,
    })
  })

  return await response.text();
}

export const getItems = async () => {
  const response = await fetch(`${ROUTE.items}`, {
    method: 'get',
  })

  return await response.json()
};

export const getItemsChecked = async () => {
  const response = await fetch(`${ROUTE.itemsChecked}`, {
    method: 'get',
  })

  return await response.json()
};

export const wordsRequests = {
  addItem,
  removeItem,
  getItems,
  getItemsChecked,
}