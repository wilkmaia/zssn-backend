'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.ZSSN_PORT || null

const survivorsRoutes = require('./api/routes/survivors')
const tradeRoutes = require('./api/routes/trade')

if (port === null) {
  console.error('Define the server port as the environment variable ZSSN_PORT')
  throw new Error('Server port not defined')
}

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/zssn')

app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(bodyParser.json())

survivorsRoutes(app)
tradeRoutes(app)

app.listen(port)

console.log('Listening on port ' + port)
