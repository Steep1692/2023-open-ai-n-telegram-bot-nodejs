const root = document.getElementById('header')

const LABEL = 'Total: '
const SEPARATOR = '/'

const makeLabel = (used, total) => `${LABEL}${used}${SEPARATOR}${total}`

const getUsedAndTotal = () => {
  const [, usedAndTotal] = root.innerText.replace(LABEL, '')
  const [used, total] = usedAndTotal.split(SEPARATOR)
  return { used, total }
}

const changeWithDelta = (deltaUsed, deltaTotal) => {
  const { used, total } = getUsedAndTotal()
  root.innerText = makeLabel(used + deltaUsed, total + deltaTotal)
}

const increaseUsed = () => {
  changeWithDelta(1, 0)
}

const decreaseUsed = () => {
  changeWithDelta(-1, 0)
}

const increaseTotal = () => {
  changeWithDelta(0, 1)
}

const decreaseTotal = () => {
  changeWithDelta(0, -1)
}

const mount = (used, total) => {
  root.innerText = makeLabel(used, total)
}

export const header = {
  increaseUsed,
  decreaseUsed,
  increaseTotal,
  decreaseTotal,
  mount,
}