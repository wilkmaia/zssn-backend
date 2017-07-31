'use strict'

const mongoose = require('mongoose')
const SurvivorSchema = require('../models/survivors')
const Survivor = mongoose.model('Survivors')

const { buildError, itemsList, pointsList } = require('../utils')

class SurvivorsController {
  create (req, res) {
    const survivor = new Survivor(req.body)

    survivor.inventory.map(item => {
      item.points = pointsList[itemsList.indexOf(item.name)]
    })

    survivor.save()
      .then(survivor => {
        res.json(survivor)
      }).catch(err => {
        res.status(500)
          .json(buildError(err.message))
      })
  }

  get (req, res) {
    Survivor.findOne({ id: req.params.id })
      .then(survivor => {
        if (survivor === null) {
          res.status(404)
            .json(buildError(`Survivor #${req.params.id} not found`))
        } else {
          res.json(survivor)
        }
      }).catch(err => {
        res.status(500)
          .json(buildError(err.message))
      })
  }

  getAll (req, res) {
    Survivor.find({})
      .then(survivors => {
        const ret = survivors.map(survivor => {
          return {
            id: survivor.id,
            name: survivor.name,
          }
        })

        res.json(ret)
      }).catch(err => {
        res.status(500)
          .json(buildError(err.message))
      })
  }

  updateLocation (req, res) {
    Survivor.findOne({ id: req.params.id })
      .then(survivor => {
        if (survivor === null) {
          res.status(404)
            .json(buildError(`Survivor #${req.params.id} not found`))
        } else if (!req.body.latitude && !req.body.longitude) {
          res.status(400)
            .json(buildError(`You must send both latitude AND longitude`))
        } else {
          survivor.latitude = req.body.latitude
          survivor.longitude = req.body.longitude
          survivor.save()

          res.json(survivor)
        }
      }).catch(err => {
        res.status(500)
          .json(buildError(err.message))
      })
  }

  flagInfected (req, res) {
    Survivor.findOne({ id: req.params.id })
      .then(survivor => {
        if (survivor === null) {
          res.status(404)
            .json(buildError(`Survivor #${req.params.id} not found`))
        } else {
          Survivor.findOne({ id: req.body.id })
            .then(referer => {
              if (referer === null) {
                res.status(404)
                  .json(buildError(`Survivor #${req.body.id} not found`))
              }
              if (survivor.infected_referers.indexOf(referer.id) === -1) {
                const count = survivor.infected_referers.push(referer.id)
                if (count === 3) {
                  survivor.infected = true
                }
                survivor.save()

                res.json(survivor)
              } else {
                res.status(400)
                  .json(buildError(`Survivor #${referer.id} already\
 flagged the survivor #${survivor.id} as infected.`))
              }

            }).catch(err => {
              res.status(500)
                .json(buildError(err.message))
            })
        }
      }).catch(err => {
        res.status(500)
          .json(buildError(err.message))
      })
  }
}

module.exports = SurvivorsController
