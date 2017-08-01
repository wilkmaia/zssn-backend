'use strict'

const mongoose = require('mongoose')
const SurvivorSchema = require('../models/survivors')
const Survivors = mongoose.model('Survivors')

const {
  buildError,
  pointsList,
  itemsList,
} = require('../utils')

class ReportsController {
  async process (req, res) {
    try {
      const survivors = await Survivors.find()
      let total = 0
      let infected = 0
      const resources = {
        water: 0,
        food: 0,
        medication: 0,
        ammunition: 0,
      }
      const lostPoints = {
        water: 0,
        food: 0,
        medication: 0,
        ammunition: 0,
      }

      survivors.map(survivor => {
        ++total
        survivor.inventory.map(item => {
          console.log(item)
          resources[item.name.toLowerCase()] += item.amount
        })

        if (survivor.infected) {
          ++infected
          survivor.inventory.map(item => {
            lostPoints[item.name.toLowerCase()] +=
              item.amount * pointsList[itemsList.indexOf(item.name)]
          })
        }
      })

      const response = {
        total,
        infected: `${(100 * infected/total).toFixed(2)}%`,
        healthy: `${(100 * (total - infected)/total).toFixed(2)}%`,
        average_resources: {
          water: `${(resources.water/total).toFixed(2)}`,
          food: `${(resources.food/total).toFixed(2)}`,
          medication: `${(resources.medication/total).toFixed(2)}`,
          ammunition: `${(resources.ammunition/total).toFixed(2)}`,
        },
        lost_points: {
          water: lostPoints.water,
          food: lostPoints.food,
          medication: lostPoints.medication,
          ammunition: lostPoints.ammunition,
          total: lostPoints.water + lostPoints.food + lostPoints.medication +
            lostPoints.ammunition,
        },
      }

      res.json(response)
    } catch (err) {
      console.error(err)

      res.status(500)
        .json(buildError(err.message))
    }
  }
}

module.exports = ReportsController
