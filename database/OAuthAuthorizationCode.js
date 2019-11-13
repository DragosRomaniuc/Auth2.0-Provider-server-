const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OAuthAuthorizationCodeSchema = new Schema({
    authorizationCode: String,
    expiresAt: Date,
    redirectUri: String,
    client: { type: Schema.Types.ObjectId, ref:'OAuthClient'},
    user: { type: Schema.Types.ObjectId, ref: 'User'}, 
    //whatever i want.. this is where
    // scope: String,
    //  i can be flexible with the protocol
});

module.exports = mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema);