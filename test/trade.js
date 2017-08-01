const chai = require('chai')
const should = chai.should()
const server =
`${process.env.ZSSN_ADDR || 'localhost'}:${process.env.ZSSN_PORT || 1234}`

const sampleSurvivor = require('../samples/survivor.json')
const sampleTrade = require('../samples/trade.json')

chai.use(require('chai-http'))
chai.use(require('chai-subset'))

let survivor = {}

describe('When trading between two survivors', function () {
  let survivor0 = {}
  let survivor1 = {}

  before(async function () {
    let res = await chai.request(server)
      .post('/survivors')
      .send(sampleSurvivor)
      .catch(err => {
        return err.response
      })

    survivor0 = res.body

    res = await chai.request(server)
      .post('/survivors')
      .send(sampleSurvivor)
      .catch(err => {
        return err.response
      })

    survivor1 = res.body

    sampleTrade[0].id = survivor0.id
    sampleTrade[1].id = survivor1.id
  })

  describe('with valid data', function () {
    let res = {}

    before(async function () {
      res = await chai.request(server)
        .post('/trade')
        .send(sampleTrade)
        .catch(err => {
          return err.response
        })
    })

    it('response code should be 200', function () {
      res.should.have.property('status').with.valueOf(200)
    })
  })

  describe('with invalid items', function () {
    let res = {}
    const previousName = sampleTrade[0].items[0].name

    before(async function () {
      sampleTrade[0].items[0].name = 'Invalid item'

      res = await chai.request(server)
        .post('/trade')
        .send(sampleTrade)
        .catch(err => {
          return err.response
        })
    })

    after(function () {
      sampleTrade[0].items[0].name = previousName
    })
    
    it('response code should be 400', function () {
      res.should.have.property('status').with.valueOf(400)
    })

    it('response should have desired properties', function () {
      res.body.should.containSubset({
        error: true,
      })
    })
  })

  describe('with invalid item amount', function () {
    let res = {}
    const previousAmount = sampleTrade[0].items[0].amount

    before(async function () {
      sampleTrade[0].items[0].amount = -1

      res = await chai.request(server)
        .post('/trade')
        .send(sampleTrade)
        .catch(err => {
          return err.response
        })
    })

    after(function () {
      sampleTrade[0].items[0].amount = previousAmount
    })
    
    it('response code should be 400', function () {
      res.should.have.property('status').with.valueOf(400)
    })

    it('response should have desired properties', function () {
      res.body.should.containSubset({
        error: true,
      })
    })
  })

  describe('with invalid points sum', function () {
    let res = {}
    const previousAmount = sampleTrade[0].items[0].amount

    before(async function () {
      sampleTrade[0].items[0].amount = 2

      res = await chai.request(server)
        .post('/trade')
        .send(sampleTrade)
        .catch(err => {
          return err.response
        })
    })

    after(function () {
      sampleTrade[0].items[0].amount = previousAmount
    })
    
    it('response code should be 400', function () {
      res.should.have.property('status').with.valueOf(400)
    })

    it('response should have desired properties', function () {
      res.body.should.containSubset({
        error: true,
      })
    })
  })

  describe('with item amount not available for the survivor', function () {
    let res = {}
    const previousAmount = sampleTrade[0].items[0].amount

    before(async function () {
      sampleTrade[0].items[0].amount = 2
      sampleTrade[1].items[0].amount = 2

      res = await chai.request(server)
        .post('/trade')
        .send(sampleTrade)
        .catch(err => {
          return err.response
        })
    })

    after(function () {
      sampleTrade[0].items[0].amount = previousAmount
    })
    
    it('response code should be 400', function () {
      res.should.have.property('status').with.valueOf(400)
    })

    it('response should have desired properties', function () {
      res.body.should.containSubset({
        error: true,
      })
    })
  })
})
