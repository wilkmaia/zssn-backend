'use strict'

const mongoose = require('mongoose')
const SurvivorSchema = require('../models/survivors')
const Survivor = mongoose.model('Survivors')

const { buildError } = require('../utils')

const itemsList = ['Water', 'Food', 'Medication', 'Ammunition']
const pointsList = [4, 3, 2, 1]

class SurvivorsController {
  create (req, res) {
    const survivor = new Survivor(req.body)

    survivor.inventory.map(item => {
      item.points = pointsList[itemsList.indexOf(item.name)]
    })

    survivor.save((err, survivor) => {
      if (err) {
        res.status(500)
          .json(buildError(err.message))
      } else {
        res.json(survivor)
      }
    })
  }

  get (req, res) {
    Survivor.find({ id: req.params.id }, (err, survivors) => {
      if (err) {
        res.status(500)
          .json(buildError(err.message))
      } else {
        if (survivors.length == 0) {
          res.status(404)
            .json(buildError(`Survivor #${req.params.id} not found`))
        } else {
          res.json(survivors[0])
        }
      }
    })
  }

  getAll (req, res) {
    Survivor.find({}, (err, survivors) => {
      if (err) {
        res.status(500)
          .json(buildError(err.message))
      } else {
        const ret = survivors.map(survivor => {
          return {
            id: survivor.id,
            name: survivor.name,
          }
        })

        res.json(ret)
      }
    })
  }
}

module.exports = SurvivorsController
