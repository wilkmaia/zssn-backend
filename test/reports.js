const chai = require('chai')
const should = chai.should()
const server =
`${process.env.ZSSN_ADDR || 'localhost'}:${process.env.ZSSN_PORT || 1234}`

const sampleSurvivor = require('../samples/survivor.json')
const sampleTrade = require('../samples/trade.json')

chai.use(require('chai-http'))
chai.use(require('chai-subset'))

let survivor = {}

describe('When GETting reports', function () {
  let res = {}

  before(async function () {
    res = await chai.request(server)
      .get('/reports')
      .send()
      .catch(err => {
        return err.response
      })
  })

  it('response code should be 200', function () {
    res.should.have.property('status').with.valueOf(200)
  })

  it('should have desired properties', function () {
    res.body.should.have.property('total')
    res.body.should.have.property('infected')
    res.body.should.have.property('healthy')
    res.body.should.have.property('average_resources').and.to.be.a('object')
    res.body.should.have.property('lost_points').and.to.be.a('object')
  })
})
