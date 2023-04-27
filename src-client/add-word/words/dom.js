const list = document.getElementById('list')

const classNameUsed = 'used'

const isUsed = (word) => {
  for (const child of [...list.children]) {
    if (child.childNodes[0].textContent === word) {
      return child.classList.contains(classNameUsed)
    }
  }
}

const add = (item, isUsed, onClickRemove) => {
  const itemElement = document.createElement('li')

  if (isUsed) {
    itemElement.classList.add(classNameUsed)
  }

  itemElement.innerHTML = item

  const btnRemove = document.createElement('button')
  btnRemove.innerHTML = 'remove'
  btnRemove.onclick = () => onClickRemove(item)

  itemElement.append(btnRemove)

  list.append(itemElement)

  if (isUsed) {
    itemElement.scrollIntoView({
      smooth: true,
    })
  }

  return itemElement
}

const remove = (word) => {
  for (const child of [...list.children]) {
    if (child.childNodes[0].textContent === word) {
      child.remove()
    }
  }
}

const mount = (items, itemsChecked, onClickRemove) => {
  for (const item of items) {
    add(item, itemsChecked.includes(item), onClickRemove)
  }
}

export const wordsList = {
  mount,
  isUsed,
  add,
  remove,
}