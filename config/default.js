const path = require('path'),
      fs = require('fs');

require('dotenv').config();

module.exports = {
    database: {
        host:  process.env.PROD_DATABASE_HOST ? `mongodb://${process.env.PROD_DATABASE_HOST}/${process.env.PROD_DATABASE_DB}` : `mongodb://127.0.0.1/oauth2db`,
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            userFindAndModify: false
        }
    },
    serverOptions: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || '3001',
        // key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
        // cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
    }
}