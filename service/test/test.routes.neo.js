var sinon = require('sinon');
var expect = require('chai').expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

var Neo = require('../db/models/neo');
var neoRoutes = require('../routes/neo');

describe('Test the Routes', () => {
    // Test will pass if we get all Neos
    it('should return all Neos', async () => {
        var NeoMock = sinon.mock(Neo);
        var expectedResult = [{
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
        NeoMock.expects('find').resolves(expectedResult);
        const result = await neoRoutes.getAllNeos();
        expect(result.lenght, 2);
        NeoMock.verify();
        NeoMock.restore();
    });


    // Test will pass if we fail 
    it('Test route get the fastest Neo', async () => {
        var NeoMock = sinon.mock(Neo);
        var expectedResult = [{
            _id: '5aaea3fab897950011cca58c',
            date: '2018-03-18T00:00:00.000Z',
            reference: '3545978',
            name: '(2010 RR80)',
            speed: '30853.5371468738',
            is_hazardous: true,
            createdAt: '2018-03-18T17:38:02.447Z',
            updatedAt: '2018-03-18T17:38:02.447Z'
        }]
        NeoMock.expects('find').withArgs({
                is_hazardous: true
            }).chain('sort').withArgs({
                speed: -1
            }).chain('limit')
            .withArgs(1)
            .resolves(expectedResult);
        const result = await neoRoutes.getFastestNeo(true);
        expect(result.lenght, 1);
        expect(result[0].is_hazardous).to.equal(true);
        NeoMock.verify();
        NeoMock.restore();
    });

    it('Test route get best month', async () => {
        var NeoMock = sinon.mock(Neo);
        var expectedResult = [{
            month: 1,
            neo_count: 10
        }]
        NeoMock.expects('aggregate').withArgs([{
                $match: {
                    is_hazardous: true
                }
            }, {
                $project: {
                    month: {
                        $month: '$date'
                    },
                }
            }, {
                $group: {
                    _id: '$month',
                    count: {
                        $sum: 1
                    }
                }
            }, {
                $project: {
                    month: '$_id',
                    neo_count: '$count'
                }
            }]).chain('sort').withArgs({
                neo_count: -1
            }).chain('limit')
            .withArgs(1)
            .resolves(expectedResult);
        const result = await neoRoutes.getBestMonth(true);
        expect(result.length).to.equal(1);
        expect(result[0].month).to.a('number');
        expect(result[0].neo_count).to.a('number');
        NeoMock.verify();
        NeoMock.restore();
    });

    it('Test route get best year', async () => {
        var NeoMock = sinon.mock(Neo);
        var expectedResult = [{
            year: 2018,
            neo_count: 10
        }]
        NeoMock.expects('aggregate').withArgs([{
                $match: {
                    is_hazardous: true
                }
            }, {
                $project: {
                    year: {
                        $year: '$date'
                    },
                }
            }, {
                $group: {
                    _id: '$year',
                    count: {
                        $sum: 1
                    }
                }
            }, {
                $project: {
                    year: '$_id',
                    neo_count: '$count'
                }
            }]).chain('sort').withArgs({
                neo_count: -1
            }).chain('limit')
            .withArgs(1)
            .resolves(expectedResult);
        const result = await neoRoutes.getBestYear(true);
        expect(result.length).to.equal(1);
        expect(result[0].year).to.a('number');
        expect(result[0].neo_count).to.a('number');
        NeoMock.verify();
        NeoMock.restore();
    });

    it('Test route to add a new Neo', async () => {
        var NeoMock = sinon.mock(Neo);
        const neoToAdd = {
            date: '2018-03-18T00:00:00.000Z',
            reference: '3545978',
            name: '(2010 RR80)',
            speed: '30853.5371468738',
            is_hazardous: false
        }
        var returning = {
            _id: '5aaea3fab897950011cca58c',
            date: '2018-03-18T00:00:00.000Z',
            reference: '3545978',
            name: '(2010 RR80)',
            speed: '30853.5371468738',
            is_hazardous: false,
            createdAt: '2018-03-18T17:38:02.447Z',
            updatedAt: '2018-03-18T17:38:02.447Z'
        }
        sinon.stub(Neo.prototype, 'save').resolves(returning);
        const result = await neoRoutes.addNeo(neoToAdd);
        expect(Neo.prototype.save.callCount).to.equal(1);
        expect(result.reference).to.equal(neoToAdd.reference);
        expect(result.is_hazardous).to.equal(false);
        expect(result._id).to.exist;
        expect(result.createdAt).to.exist;
        expect(result.updatedAt).to.exist;
        NeoMock.verify();
        NeoMock.restore();
    });

    it('Test route to add wrong neo', async () => {
        const neoToAdd = {
            date_of_neo: '2018-03-18T00:00:00.000Z',
            reference: 3545978,
            name_of_val: '(2010 RR80)',
            speed: '30853.5371468738',
            is_hazardous: 'false'
        }
        try {
            await neoRoutes.addNeo(neoToAdd);
            throw ('Should have failed');
        } catch (err) {
            return;
        }
    });
});