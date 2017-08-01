'use strict'

const itemsList = ['Water', 'Food', 'Medication', 'Ammunition']
const pointsList = [4, 3, 2, 1]

function buildError (message) {
  return {
    error: true,
    message,
  }
}

// Checks if the `survivor` has all the items on the `items` array
// including their quantities
//
// The check is made by mapping all of the `items` elements with a function
// that check if the `survivor` has the said `item`.
//
// The `hasItem` array should have one `true` value if the `survivor` has the
// `item`. The `test` array should have ONLY `true` values if the `survivor`
// has ALL `items`.
function hasItems (survivor, items) {
  const test = items.map(item => {
    const hasItem = survivor.inventory.map(survivorItem => {
      if (item.name === survivorItem.name &&
          item.amount <= survivorItem.amount) {
        return true
      }

      return false
    })

    return hasItem.indexOf(true) !== -1
  })

  return test.indexOf(false) === -1
}

function calculatePoints (items) {
  const pointsSum = items.map(item => {
    return pointsList[itemsList.indexOf(item.name)] * item.amount
  }).reduce((sum, v) => {
    return sum + v
  })

  return pointsSum
}

function addItem (survivor, item) {
  const alreadyHasItem = survivor.inventory.map(survivorItem => {
    if (survivorItem.name === item.name) {
      survivorItem.amount += item.amount

      return true
    }

    return false
  })

  if (alreadyHasItem.indexOf(true) === -1) {
    item.points = pointsList[itemsList.indexOf(item.name)]
    survivor.inventory.push(item)
  }
}

function removeItem (survivor, item) {
  const hasItem = survivor.inventory.map((survivorItem, idx) => {
    if (survivorItem.name === item.name) {
      if (survivorItem.amount < item.amount) {
        throw new Error(`Survivr #${survivor.id} doesn't have \
enough '${item.name}'`)
      }
      survivorItem.amount -= item.amount

      if (survivorItem.amount === 0) {
        survivor.inventory.splice(idx, 1)
      }

      return true
    }

    return false
  })

  if (hasItem.indexOf(true) === -1) {
    throw new Error(`Survivor #${survivor.id} doesn't have '${item.name}'`)
  }
}

module.exports = {
  buildError,
  hasItems,
  calculatePoints,
  addItem,
  removeItem,
  itemsList,
  pointsList,
}
