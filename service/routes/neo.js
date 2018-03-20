const path = require('path');
const neoController = require(path.join(__dirname, '../controller/neo'));

module.exports = ((server) => {
    const getFastest = (async (req, res, next) => {
        'use strict';
        console.log('Getting fastest neo');
        try {
            const hzd = (req.query.hazardous === 'true');
            const data = await neoController.getFastestNeo(hzd);
            res.header('content-type', 'json');
            res.status(200);
            res.send(data[0]);
            res.end();
            next();
        } catch (err) {
            console.error(err.stack);
            next(400, err);
        }
    });

    const getBestYear = (async (req, res, next) => {
        'use strict';
        console.log('Getting best year neo');
        try {
            const hzd = (req.query.hazardous === 'true');
            const data = await neoController.getBestYear(hzd);
            res.header('content-type', 'json');
            res.status(200);
            res.send(data);
            res.end();
            next();
        } catch (err) {
            console.error(err.stack);
            next(400, err);
        }
    });

    const getBestMonth = (async (req, res, next) => {
        'use strict';
        console.log('Getting best month neo');
        try {
            const hzd = (req.query.hazardous === 'true');
            const data = await neoController.getBestMonth(hzd);
            res.header('content-type', 'json');
            res.status(200);
            res.send(data);
            res.end();
            next();
        } catch (err) {
            console.error(err.stack);
            next(400, err);
        }
    });

    const listNeo = (async (req, res, next) => {
        'use strict';
        console.log('Listing all neos');
        try {
            const data = await neoController.getAllNeos();
            res.header('content-type', 'json');
            res.status(200);
            res.send({
                neos: data
            });
            res.end();
            next();
        } catch (err) {
            console.error(err.stack);
            next(400, err);
        }
    });

    const addNeo = (async (req, res, next) => {
        'use strict';
        console.log('Adding an neo');
        try {
            const data = await neoController.addNeo(req.body);
            res.header('content-type', 'json');
            res.status(201);
            res.send(data);
            res.end();
            next();
        } catch (err) {
            console.error(err.stack);
            next(400, err);
        }
    });

    server.get('/neo/hazardous', listNeo);
    server.post('/neo/hazardous', addNeo);

    server.get('/neo/fastest', getFastest);

    server.get('/neo/best-year', getBestYear);

    server.get('/neo/best-month', getBestMonth);

});
