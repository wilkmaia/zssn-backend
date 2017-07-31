'use strict'

const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const Schema = mongoose.Schema
const itemsList = ['Water', 'Food', 'Medication', 'Ammunition']
const connection = mongoose.createConnection('mongodb://localhost/zssn', {
  useMongoClient: true,
})

autoIncrement.initialize(connection)

const ItemSchema = new Schema({
  name: {
    type: String,
    enum: itemsList,
    required: 'An item needs its name',
  },
  amount: {
    type: Number,
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
    required: 'A survivor needs an age',
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: 'A survivor needs a sex',
  },
  location_x: {
    type: Number,
    required: 'A survivor needs its location (x)',
  },
  location_y: {
    type: Number,
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
      last_location_x: ret.location_x,
      last_location_y: ret.location_y,
      inventory: ret.inventory,
      infected: ret.infected,
    }

    return retJson
  },
})

SurvivorSchema.plugin(autoIncrement.plugin, {
  model: 'Survivors',
  field: 'id',
})

module.exports = mongoose.model('Survivors', SurvivorSchema)
