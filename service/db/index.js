const mongoose = require('mongoose');

const PORT = process.env.DATABASE_PORT || 27017;
const HOST = process.env.DATABASE_HOST || 'database';
const NAME = process.env.DATABASE_NAME || 'neos';


const url = 'mongodb://' + HOST + ':' + PORT + '/' + NAME;

// Initialize the connection.
mongoose.connect(url, {
    autoReconnect: true,
    reconnectTries: 30,
    reconnectInterval: 1000,
});

let db = mongoose.connection;
// Log errors
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log("Connected to MongoDB...");
});

// When the connection is disconnected
db.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    db.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

require('./models/neo');