const restify = require('restify');
const views = require('./views');

const PORT = process.env.PORT | '8080';
// Initialize restify server 
server = restify.createServer();

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

server.listen(PORT, async () => {
    'use strict';
    if (!(process.env.TEST_MODE === 'true')) {
        require('./db');
    }
    views(server);
    console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;