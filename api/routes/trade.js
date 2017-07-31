'use strict'

const Controller = require('../controllers/trade')

const router = function (app) {
  const controller = new Controller()

  app.route('/trade')
    .post(controller.process)
}

module.exports = router
