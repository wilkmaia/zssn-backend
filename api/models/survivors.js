'use strict'

const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const Schema = mongoose.Schema
const { itemsList } = require('../utils')

const connection = mongoose.createConnection('mongodb://localhost/zssn')

autoIncrement.initialize(connection)

const ItemSchema = new Schema({
  name: {
    type: String,
    enum: itemsList,
    required: 'An item needs its name',
  },
  amount: {
    type: Number,
    min: [1, 'The amount must be positive'],
    default: 1,
  },
  points: {
    type: Number,
    required: true,
  },
})

ItemSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    const retJson = {
      name: ret.name,
      amount: ret.amount,
      points: ret.points,
    }

    return retJson
  },
})

const SurvivorSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: 'A survivor needs a name',
  },
  age: {
    type: Number,
    min: [0, 'The survivor must be at least 0 years old'],
    required: 'A survivor needs an age',
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: 'A survivor needs a sex',
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90,
    required: 'A survivor needs its location (x)',
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
    required: 'A survivor needs its location (y)',
  },
  inventory: {
    type: [ItemSchema],
    required: 'A survivor needs its inventory',
  },
  infected: {
    type: Boolean,
    default: false,
  },
  infected_referers: {
    type: [Number],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
})

SurvivorSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    const retJson = {
      id: ret.id,
      name: ret.name,
      age: ret.age,
      gender: ret.gender,
      last_latitude: ret.latitude,
      last_longitude: ret.longitude,
      inventory: ret.inventory,
      infected: ret.infected,
      infected_referers: ret.infected_referers,
    }

    return retJson
  },
})

SurvivorSchema.plugin(autoIncrement.plugin, {
  model: 'Survivors',
  field: 'id',
})

module.exports = mongoose.model('Survivors', SurvivorSchema)
