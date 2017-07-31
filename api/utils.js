'use strict'

const itemsList = ['Water', 'Food', 'Medication', 'Ammunition']
const pointsList = [4, 3, 2, 1]

function buildError (message) {
  return {
    error: true,
    message,
  }
}

module.exports = {
  buildError,
}
