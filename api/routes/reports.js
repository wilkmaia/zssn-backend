'use strict'

const Controller = require('../controllers/reports')

const router = function (app) {
  const controller = new Controller()

  app.route('/reports')
    .get(controller.process)
}

module.exports = router
