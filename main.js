const express = require('express'),
      https = require('https'),
      config = require('config'),
      http = require('http');


const database = require('./database');
const app = express();

require('dotenv').config();
require('./old/app')(app);
database.connect();

(async () => {
    try {
        // const server = await https.createServer(config.serverOptions, app);
        const server = await http.createServer(app);
        await server.listen(app.get('port'));
        console.log('Server listening on port', app.get('port'));
    } catch (e) {
        // logger.error(e);
        console.log('Error on listening port', app.get('port'));
        throw e;
    }
})();