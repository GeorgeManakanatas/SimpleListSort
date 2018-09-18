// =============================================================================
//                      Environment validation and set-up
// =============================================================================
require('dotenv').config({path:__dirname + '/.env'});
//Path is set so server.js does not depend on the current working directory.

// Ensure required ENV vars are set
const requiredEnv = [
    'ENVIRONMENT',
    'DB_PORT', 'DB_HOST', 'DB_PROTOCOL', 'DB_NAME', 'DB_USER', // database variables
    'ALLOWED_ORIGINS'
];

const unsetEnv = requiredEnv.filter((envVar) => !(typeof process.env[envVar] !== 'undefined'));

// Abort if the environment isn't setup properly
if (unsetEnv.length > 0) {
    throw new Error('Required ENV variables are not set: [' + unsetEnv.join(', ') + ']');
}

// =============================================================================
//                                 REQUIRES
// =============================================================================
const express = require('express'),
    https = require('https'),
    http = require('http'),
    helmet = require('helmet'),
    fs = require('fs');

//  BASICS
// =============================================================================
const app = express();

// General security best practice, disables x-powered-by and other standard things.
app.use(helmet());

// DATA BASE SETUP
// =============================================================================

// build database connection string
// no username and password being used
const databaseConnection = process.env.DB_PROTOCOL + '://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

//connect to database
.connect(databaseConnection, { useMongoClient: true }, function(err) {
    if (err) {
        console.error('Connection to database error:', err);
        return;
    }
    // if no error connecting then flag is true
    console.log('Successfully connected to Database');
    console.log('starting the server');
    // start the server
    startTheServer(function(startFlag){
        console.log('server started:', startFlag);
    });
});

// ROUTES FOR API
// =============================================================================

// imported from index of controllers folder to declutter this level.
app.use(require('./routes'));


// START THE SERVER, QUEUEING, etc
// =============================================================================
// starting the server
function startTheServer(callback){
    // set our port
    const port = process.env.PORT;
    let server = null;
    // server if tls in config is true then https else default to http
    if(process.env.USE_TLS === 'true'){
        console.log(process.env.USE_TLS);
        const options = {
            key : fs.readFileSync(process.env.TLS_KEY),
            cert : fs.readFileSync(process.env.TLS_CERT)
        };
        server = https.createServer(options, app);
    } else {
        server = http.createServer(app);
    }
    // start server listening to port
    server.listen(port);
    const startFlag = 'server started';
    callback(startFlag);
}

module.exports = app;
