'use strict'

const Controller = require('../controllers/survivors')

const router = function (app) {
  const controller = new Controller()

  app.route('/survivors')
    .post(controller.create)
    .get(controller.getAll)

  app.route('/survivors/:id')
    .get(controller.get)

  app.route('/survivors/:id/location')
    .post(controller.updateLocation)
}

module.exports = router
