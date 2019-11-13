// ************ DEPENDENCIES ********** /
const express = require('express');
const helmet = require('helmet');
// const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('config');
const bodyParser = require('body-parser');

// ***** Local ************************ //
var indexRouter = require('./routes/index');
require('dotenv').config();


module.exports = app => {
    app.set('host', config.serverOptions.host );
    app.set('port', config.serverOptions.port );

    // HTTP HEADERS
    app.disable('x-powered-by');
    app.use(helmet.frameguard({section: 'deny'}));
    app.use(helmet.hsts({force: true, maxAge: 7776000}));
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(helmet.ieNoOpen());
    // app.use(methodOverride('_method'));
    app.use(morgan('dev'));    
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser())


    app.use('/', indexRouter);

   
    app.use((req, res, next) => {
        const error = new Error("Not Found");
        error.status = 404;
        next(error);
    })

    app.use((req, res, next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message
            }
        });
    })
    
}