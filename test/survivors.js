const chai = require('chai')
const should = chai.should()
const server =
`${process.env.ZSSN_ADDR || 'localhost'}:${process.env.ZSSN_PORT || 1234}`

const sampleSurvivor = require('../samples/survivor.json')

chai.use(require('chai-http'))
chai.use(require('chai-subset'))

let survivor = {}

describe('When registering a new survivor', function () {
  describe('with valid data', function () {
    let res = {}

    before(async function () {
      res = await chai.request(server)
        .post('/survivors')
        .send(sampleSurvivor)
        .catch(err => {
          return err.response
        })

      survivor = res.body
    })

    it('response code should be 200', function () {
      res.should.have.property('status').with.valueOf(200)
    })

    it('response should have desired properties', function () {
      sampleSurvivor.last_latitude = sampleSurvivor.latitude
      sampleSurvivor.last_longitude = sampleSurvivor.longitude

      delete sampleSurvivor.latitude
      delete sampleSurvivor.longitude

      res.body.should.containSubset(sampleSurvivor)
    })
  })

  describe('with invalid data', function () {
    let res = {}

    before(async function () {
      res = await chai.request(server)
        .post('/survivors')
        .send()
        .catch(err => {
          return err.response
        })
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

describe('When GETting data from', function () {
  describe('all survivors', function () {
    let res = {}

    before(async function () {
      res = await chai.request(server)
        .get('/survivors')
        .send()
        .catch(err => {
          return err.response
        })
    })

    it('response code should be 200', function () {
      res.should.have.property('status').with.valueOf(200)
    })

    it('response should be an array', function () {
      res.body.should.be.a('array')
    })
  })

  describe('specific survivor', function () {
    let res = {}

    before(async function () {
      res = await chai.request(server)
        .get(`/survivors/${survivor.id}`)
        .send()
        .catch(err => {
          return err.response
        })
    })

    it('response code should be 200', function () {
      res.should.have.property('status').with.valueOf(200)
    })

    it('response should have desired properties', function () {
      res.body.should.containSubset(sampleSurvivor)
    })
  })
})

describe('When updating survivor', function () {
  describe('when updating location', function () {
    describe('with valid payload', function () {
      let res = {}

      before(async function () {
        res = await chai.request(server)
          .put(`/survivors/${survivor.id}/location`)
          .send({
            latitude: 15,
            longitude: 15,
          })
          .catch(err => {
            return err.response
          })
      })

      it('response code should be 200', function () {
        res.should.have.property('status').with.valueOf(200)
      })

      it('response should have desired properties', function () {
        res.body.should.containSubset({
          last_latitude: 15,
          last_longitude: 15,
        })
      })
    })

    describe('with missing data', function () {
      let res = {}

      before(async function () {
        res = await chai.request(server)
          .put(`/survivors/${survivor.id}/location`)
          .send({
            latitude: 18,
          })
          .catch(err => {
            return err.response
          })
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

    describe('with invalid data', function () {
      let res = {}

      before(async function () {
        res = await chai.request(server)
          .put(`/survivors/${survivor.id}/location`)
          .send({
            latitude: 15,
            longitude: -200,
          })
          .catch(err => {
            return err.response
          })
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

  describe('when flagging as infected', function () {
    let survivor2 = {}
    let survivor3 = {}

    before(async function () {
      sampleSurvivor.latitude = 10
      sampleSurvivor.longitude = 10

      survivor2 = await chai.request(server)
        .post('/survivors')
        .send(sampleSurvivor)
        .catch(err => {
          return err.response
        })
      survivor2 = survivor2.body

      survivor3 = await chai.request(server)
        .post('/survivors')
        .send(sampleSurvivor)
        .catch(err => {
          return err.response
        })
      survivor3 = survivor3.body
    })

    describe('first flagging', function () {
      let res = {}

      before(async function () {
        res = await chai.request(server)
          .put(`/survivors/${survivor.id}/infected`)
          .send({
            id: survivor2.id,
          })
          .catch(err => {
            return err.response
          })
      })

      it('response code should be 200', function () {
        res.should.have.property('status').with.valueOf(200)
      })

      it('survivor should contain 1 flag referer', function () {
        res.body.should.containSubset({
          infected_referers: [survivor2.id],
          infected: false,
        })
      })
    })

    describe('second flagging', function () {
      let res = {}

      before(async function () {
        res = await chai.request(server)
          .put(`/survivors/${survivor.id}/infected`)
          .send({
            id: survivor3.id,
          })
          .catch(err => {
            return err.response
          })
      })

      it('response code should be 200', function () {
        res.should.have.property('status').with.valueOf(200)
      })

      it('survivor should contain 2 flag referers', function () {
        res.body.should.containSubset({
          infected_referers: [survivor2.id, survivor3.id],
          infected: false,
        })
      })
    })

    describe('when attempting to flag again', function () {
      let res = {}

      before(async function () {
        res = await chai.request(server)
          .put(`/survivors/${survivor.id}/infected`)
          .send({
            id: survivor3.id,
          })
          .catch(err => {
            return err.response
          })
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

    describe('third flagging', function () {
      let res = {}

      before(async function () {
        res = await chai.request(server)
          .put(`/survivors/${survivor.id}/infected`)
          .send({
            id: survivor.id,
          })
          .catch(err => {
            return err.response
          })
      })

      it('response code should be 200', function () {
        res.should.have.property('status').with.valueOf(200)
      })

      it('survivor should contain 3 flag referers and be infected', function () {
        res.body.should.containSubset({
          infected_referers: [survivor2.id, survivor3.id],
          infected: true,
        })
      })
    })
  })
})
