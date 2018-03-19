const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const mongoose = require('mongoose');
require('sinon-mongoose');
const supertest = require('supertest');

process.env.TEST_MODE = true;

const server = require('../server');
const neoRouter = require('../routes/neo');


describe('Test Neo API', () => {
  after(function (done) {
    server.close();
    done();
  });
  const request = supertest(server);
  it('test hello world', () => {
    request
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body, {
          hello: 'world'
        })
      })
  });
  it('test list all Neos', (done) => {
    let NeoMock = sinon.mock(neoRouter);
    const listNeos = [{
        _id: '5aaea3fab897950011cca58c',
        date: '2018-03-18T00:00:00.000Z',
        reference: '3545978',
        name: '(2010 RR80)',
        speed: '30853.5371468738',
        is_hazardous: false,
        createdAt: '2018-03-18T17:38:02.447Z',
        updatedAt: '2018-03-18T17:38:02.447Z'
      },
      {
        _id: '5aaea3fab897950011cca58e',
        date: '2018-03-18T00:00:00.000Z',
        reference: '3018334',
        name: '(1999 FA)',
        speed: '42222.6530544719',
        is_hazardous: true,
        createdAt: '2018-03-18T17:38:02.458Z',
        updatedAt: '2018-03-18T17:38:02.458Z'
      }
    ]
    NeoMock.expects('getAllNeos').resolves(listNeos)
    request
      .get('/neo/hazardous')
      .then(response => {
        expect('Content-Type', /json/);
        expect(response.statusCode).to.equal(200);
        expect(response.body.neos).to.exist;
        expect(response.body.neos.length).to.equal(2);
        NeoMock.verify();
        NeoMock.restore();
        done();
      })
  });
  it('test get fastests Neo', (done) => {
    let NeoMock = sinon.mock(neoRouter);
    const fastNeoHzdFalse = {
      _id: '5aaea3fab897950011cca58c',
      date: '2018-03-18T00:00:00.000Z',
      reference: '3545978',
      name: '(2010 RR80)',
      speed: '30853.5371468738',
      is_hazardous: false,
      createdAt: '2018-03-18T17:38:02.447Z',
      updatedAt: '2018-03-18T17:38:02.447Z'
    }
    NeoMock.expects('getFastestNeo').withArgs(false).resolves(fastNeoHzdFalse);
    request
      .get('/neo/fastest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.is_hazardous).to.equal(false);
        NeoMock.verify();
        NeoMock.restore();
        done();
      })
  });
  it('test get fastests Neo hazardous is true', (done) => {
    let NeoMock = sinon.mock(neoRouter);
    const fastNeoHzdTrue = {
      _id: '5aaea3fab897950011cca58e',
      date: '2018-03-18T00:00:00.000Z',
      reference: '3018334',
      name: '(1999 FA)',
      speed: '42222.6530544719',
      is_hazardous: true,
      createdAt: '2018-03-18T17:38:02.458Z',
      updatedAt: '2018-03-18T17:38:02.458Z'
    }
    NeoMock.expects('getFastestNeo').withArgs(true).resolves(fastNeoHzdTrue)
    request
      .get('/neo/fastest?hazardous=true')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.is_hazardous).to.equal(true);
        NeoMock.verify();
        NeoMock.restore();
        done();
      })
  });
  it('test get Best Month Neo', (done) => {
    let NeoMock = sinon.mock(neoRouter);
    const bestMount = {
      month: 1,
      neo_count: 10
    }
    NeoMock.expects('getBestMonth').withArgs(false).resolves(bestMount);
    request
      .get('/neo/best-month')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.month).to.a('number');
        expect(response.body.neo_count).to.a('number');
        NeoMock.verify();
        NeoMock.restore();
        done();
      })
  });
  it('test get Best Month Neo hazardous is true', (done) => {
    let NeoMock = sinon.mock(neoRouter);
    const bestMount = {
      month: 1,
      neo_count: 10
    }
    NeoMock.expects('getBestMonth').withArgs(true).resolves(bestMount);
    request
      .get('/neo/best-month?hazardous=true')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.month).to.a('number');
        expect(response.body.neo_count).to.a('number');
        NeoMock.verify();
        NeoMock.restore();
        done();
      })
  });

  it('test get Best Year Neo', (done) => {
    let NeoMock = sinon.mock(neoRouter);
    const bestYear = {
      year: 1,
      neo_count: 10
    }
    NeoMock.expects('getBestYear').withArgs(false).resolves(bestYear);
    request
      .get('/neo/best-year')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.year).to.a('number');
        expect(response.body.neo_count).to.a('number');
        NeoMock.verify();
        NeoMock.restore();
        done();
      })
  });
  it('test get Best Year Neo hazardous is true', (done) => {
    let NeoMock = sinon.mock(neoRouter);
    const bestYear = {
      year: 1,
      neo_count: 10
    }
    NeoMock.expects('getBestYear').withArgs(true).resolves(bestYear);
    request
      .get('/neo/best-year?hazardous=true')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.year).to.a('number');
        expect(response.body.neo_count).to.a('number');
        NeoMock.verify();
        NeoMock.restore();
        done();
      })
  });
  it('test add a new Neo', (done) => {
    const data = {
      date: '2018-03-18T00:00:00.000Z',
      reference: '3545978',
      name: '(2010 RR80)',
      speed: '30853.5371468738',
      is_hazardous: true,
    }
    const returning = {
      _id: '5aaea3fab897950011cca58c',
      date: '2018-03-18T00:00:00.000Z',
      reference: '3545978',
      name: '(2010 RR80)',
      speed: '30853.5371468738',
      is_hazardous: true,
      createdAt: '2018-03-18T17:38:02.447Z',
      updatedAt: '2018-03-18T17:38:02.447Z'
    }
    let NeoMock = sinon.mock(neoRouter);
    NeoMock.expects('addNeo').resolves(returning)
    request
      .post('/neo/hazardous')
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        expect(response.body._id).to.exist;
        expect(response.body.reference, '3545978');
        expect(response.body.name, '(2010 RR80)');
        expect(response.body.is_hazardous).to.be.true;
        NeoMock.verify();
        NeoMock.restore();
        done();
      })
  });

  it('test add a wrong new Neo should fail with 400', () => {
    const data = {
      date: '2018-03-18T00:00:00.000Z',
      reference_id: '3545978',
      name: '(2010 RR80)',
      speed: 30853.5371468738,
      is_hazardous: true,
    }
    let NeoMock = sinon.mock(neoRouter);
    NeoMock.expects('addNeo').rejects('Error casting neo to object')
    request
      .post('/neo/hazardous')
      .expect(400)
  });
});