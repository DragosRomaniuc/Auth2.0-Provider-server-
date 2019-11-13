const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RegisteredEntity = new Schema({
    name: String,
    domain: {
        type: String,
        required: true
    },
    client: {
        type: { type: [Schema.Types.ObjectId], ref: 'OAuthClient'}
    }
});

module.exports = mongoose.model('RegisteredEntity', RegisteredEntity);