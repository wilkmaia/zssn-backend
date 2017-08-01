'use strict'

const router = function (app) {
  app.route('/_health_check')
    .get(function (req, res) {
      res.send()
    })
}

module.exports = router
