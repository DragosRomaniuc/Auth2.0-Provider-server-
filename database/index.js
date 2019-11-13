const mongoose = require('mongoose');
const config = require('config');
const OAuthAccessToken = require('./OAuthAccessToken');
const OAuthAuthorizationCode = require('./OAuthAuthorizationCode');
const OAuthClient = require('./OAuthClient');
const OAuthRefreshToken = require('./OAuthRefreshToken');
const OAuthScope = require('./OAuthScope');
const RegisteredEntity = require('./RegisteredEntity');
const User = require('./User');

mongoose.Promise = Promise;


function connect() {
    mongoose.connect(config.database.host, config.database.options)
        .then(() => {
        console.log('Mongoose connected!');
    })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = {
    connect,
    User,
    OAuthClient,
    OAuthAccessToken,
    OAuthAuthorizationCode,
    OAuthRefreshToken,
    OAuthScope,
    RegisteredEntity
}