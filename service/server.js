const restify = require('restify');
const routes = require('./routes');

const PORT = process.env.PORT | '8080';
// Initialize restify server 
server = restify.createServer();
// Force restify  to parse the query and json body to the request
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.jsonBodyParser({
    mapParams: true
}));
server.use(restify.plugins.fullResponse());

// Default all uncauth exception to a 400 with the error message
server.on('uncaughtException', (req, res, route, err) => {
    'use strict';
    console.error(err.stack);
    res.status(400)
    res.send(err);
});

// Default route : return `Hello world`:
server.get('/', (req, res, next) => {
    res.header('content-type', 'json');
    res.send({
        'hello': 'world!'
    });
    res.end();
});
server.head('/', (req, res, next) => {
    res.header('content-type', 'json');
    res.send({
        'hello': 'world!'
    });
    res.end();
});

// Server listen
server.listen(PORT, async () => {
    'use strict';
    // Hack to not connect to mongo when running in test mode
    if (!(process.env.TEST_MODE === 'true')) {
        require('./db');
    }
    routes(server);
    console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;
