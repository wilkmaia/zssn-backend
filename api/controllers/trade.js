'use strict'

const {
  buildError,
  hasItems,
  calculatePoints,
  addItem,
  removeItem,
} = require('../utils')

class TradeController {
  async process (req, res) {
    try {
      const survivor0 = await Survivor.findOne({ id: req.body[0].id })
      const survivor1 = await Survivor.findOne({ id: req.body[1].id })
      const items0 = req.body[0].items
      const items1 = req.body[1].items

      if (survivor0 === null) {
        res.status(400)
          .json(buildError(`Survivor #${req.body[0].id} not found`))
        return
      }

      if (survivor1 === null) {
        res.status(400)
          .json(buildError(`Survivor #${req.body[1].id} not found`))
        return
      }

      if (!hasItems(survivor0, items0)) {
        res.status(400)
          .json(buildError(`Survivor #${survivor0.id} does not have\
 the listed items.`))
        return
      }

      if (!hasItems(survivor1, items1)) {
        res.status(400)
          .json(buildError(`Survivor #${survivor1.id} does not have\
 the listed items.`))
        return
      }

      if (calculatePoints(items0) !== calculatePoints(items1)) {
        res.status(400)
          .json(buildError(`Items points sum differ.`))
        return
      }

      items0.map(item => {
        addItem(survivor1, item)
        removeItem(survivor0, item)
      })

      items1.map(item => {
        addItem(survivor0, item)
        removeItem(survivor1, item)
      })

      await survivor0.save()
      await survivor1.save()

      res.send()
    } catch (err) {
      console.error(err)

      res.status(500)
        .json(buildError(err.message))
    }
  }
}

module.exports = TradeController
