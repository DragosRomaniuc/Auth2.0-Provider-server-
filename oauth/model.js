const _ = require('lodash');
const async = require('async');
const crypto = require('crypto');
const db = require('./../database/index');

const User = db.User,
      OAuthClient = db.OAuthClient,
      OAuthAccessToken = db.OAuthAccessToken,
      OAuthAuthorizationCode = db.OAuthAuthorizationCode,
      OAuthRefreshToken = db.OAuthRefreshToken;





async function getClient(clientId, clientSecret) {
    console.group('getClient');
    console.log('getClient', clientId, clientSecret);
        try {
            const query = { clientId };
            if(clientSecret) {
                query.clientSecret = clientSecret;
            }
        
            let client = await OAuthClient
                .findOne(query)
                .lean();
    
            clent = client ? Object.assign(client, { id: clientId }) : null ;
        
            return new Promise( resolve => {
                console.log('getClient - Returned Promise ', client);
                console.groupEnd();
                resolve(client);
            });
    
        } catch (error) {
            console.log('getClient - Err: ', error);
            console.groupEnd();
        }
    };

async function saveToken(token, client, user) {
        console.group('saveToken');
        console.log('saveToken', token, client, user);
        try {
            let _1 = () => OAuthAccessToken.create({
                accessToken: token.accessToken,
                accessTokenExpiresAt: token.accessTokenExpiresAt,
                client: client._id,
                user: user._id,
                scope: token.scope 
            });
        
            let _2 = () => token.refreshToken ? OAuthRefreshToken.create({
                refreshToken: token.refreshToken,
                refreshToeknExpiresAt: token.refreshToeknExpiresAt,
                client: client._id,
                user: user._id,
                scope: token.scope
            }) : Promise.resolve();
        
            await Promise.all([_1(), _2()]);
            let toReturn = _.assign({ client, user }, token);
            return new Promise( resolve => {
                resolve(toReturn);
            });
        } catch (error) {
            console.log('saveToken - Err: ', error);
        }
    };

async function getAccessToken(accessToken){
    console.group('getAccessToken');
    console.log('getAccessToken', accessToken);
    try {
        if (!accessToken || accessToken === 'undefined') return false;
        const dbToken = await OAuthAccessToken
        .findOne({ accessToken })
        // .populate('user')
        .populate('client')
        .lean();
        return new Promise(resolve => {
            console.log('returned promise', dbToken);
            console.groupEnd();
            resolve(dbToken);
        });
    } catch (error) {
        console.log('getAccessToken - Err: ', error);
        console.groupEnd();
    }
};


async function getRefreshToken(refreshToken) {
    console.group('getRefreshToken');
    console.log('getRefreshToken', refreshToken);
    try {
        let dbToken = await OAuthRefreshToken
            .findOne({ refreshToken })
            // .populate('user')
            .populate('client')
            .lean();
        if(!dbToken) {
            return false;
        }

        const extendedClient = Object.assign(dbToken.client, { id: dbToken.client.clientId });
        const toReturn = Object.assign(dbToken, { client: extendedClient });
        console.log('revokeToken - returned Promise: ', toReturn);
        console.groupEnd();
        return new Promise(resolve => {
            resolve(toReturn);
        })
    } catch (error) {
        console.log('getRefreshToken - Err: ', error);
        console.groupEnd();
    }
};

async function revokeToken(token) {
    console.group('revokeToken');
    console.log('revokeToken', token);
    try {
        if (!token || token === 'undefined') return false
        const removed = !! await OAuthRefreshToken.findOneAndRemove({
            refreshToken: token.refreshToken
        });
        return new Promise(resolve => resolve(removed));
    } catch (error) {
        console.log('revokeToken - Err: ', error);
        console.groupEnd();
    };
};



// async function generateAuthorizationCode(client, user, scope){
//     console.group('generateAuthorizationCode');
//     console.log('generateAuthorizationCode', client, user);
//    
// 
//     (node_modules/express-oauth-server/node_modules/oauth2-server)
//       lib/handlers/authorize-handler.js
//      (around line 136):

//     AuthorizeHandler.prototype.generateAuthorizationCode = function (client, user, scope) {
//       if (this.model.generateAuthorizationCode) {
//         // Replace this
//         //return promisify(this.model.generateAuthorizationCode).call(this.model, client, user, scope);
//         // With this
//         return this.model.generateAuthorizationCode(client, user, scope)
//       }
//       return tokenUtil.generateRandomToken();
//     };
//     */

//    const seed = crypto.randomBytes(256)
//    const code = crypto
//      .createHash('sha1')
//      .update(seed)
//      .digest('hex');
//    console.log('generateAuthorizationCode - return: ', code);
//    console.groupEnd();
//    return code;
// }

async function getUser(username, password) {
    // TODO HASHING PASSWORD;
    console.group('getUser');
    console.log('getUser', username);
    try {
        let user = await User
        .findOne({ username, password })
        .lean();

        return new Promise(resolve => resolve(user));
    } catch (err) {
        console.log('getUser Err: ', err);
        console.groupEnd();
    }
};



async function saveAuthorizationCode(code, client, user) {
    console.group('saveAuthorizationCode');
    console.log('saveAuthorizationCode', code, client, user);
    try {
        const result = await OAuthAuthorizationCode
                    .create({
                    expiresAt: code.expiresAt,
                    client: client._id,
                    authorizationCode: code.authorizationCode,
                    user: user._id,
                    scope: code.scope
                    });
        // const toReturn = Object.assign({redirectUri: `${code.redirectUri}`}, result.authorizationCode);
        console.log('saveAuthorizationCode - returned Promise: ', result);
        console.groupEnd();
        return new Promise(resolve => resolve(result));
    } catch (error) {
        console.log('saveAuthorizationCode - Err: ', error);
        console.groupEnd();
    };

};

async function getAuthorizationCode(authorizationCode) {
    console.group('getAuthorizationCode');
    console.log('getAuthorizationCode', authorizationCode);
    try {
        const authCodeModel = await OAuthAuthorizationCode
                        .findOne({ authorizationCode })
                        .populate('user')
                        .populate('client')
                        .lean();
        if(!authCodeModel) {
            return false;
        }
        const extendedClient = Object.assign(authCodeModel.client, {id: authCodeModel.client.clientId});
        const toReturn = Object.assign(authCodeModel, { client: extendedClient });
        return new Promise(resolve => resolve(authCodeModel));
    } catch (error) {
        console.log('getAuthorizationCode err: ',error);
        console.groupEnd();
    };
};


async function revokeAuthorizationCode(authorizationCode) {
    console.group('revokeAuthorizationCode');
    console.log('revokeAuthorizationCode - ', authorizationCode);
    try {
        const removed = !!await OAuthAuthorizationCode.findOneAndRemove({ authorizationCode: authorizationCode.authorizationCode });
        console.log('revokeAuthorizationCode return Promise: ', removed);
        console.groupEnd();
        return new Promise(resolve => resolve(removed));
    } catch (error) {
        console.log('revokeAuthorizationCode Err: - ', error);
        console.groupEnd();
    }
};


function verifyScope(token, scope) {
    console.group('verifyScope');
    console.log('verifyScope', token, scope);
    return token.scope === scope;
};


function getUserFromClient(client) {
    console.group('getUserFromClient');
    console.log('getUserFromClient', client);
};


// In case there is a need to scopes for the user, uncomment the code
// It will also be required to provide scopes for both user and client

// function validateScope(user, client, scope) {
//     console.group('validateScope');
//     console.log('validateScope', user, client, scope);
// };


module.exports = {
    // generateAccessToken(client, user, scope), optional
    // generateAuthorizationCode(), optional,
    // generateRefreshToken(client, user, scope), optional
    // generateAuthorizationCode,
    getAccessToken,
    getAuthorizationCode,
    getClient,
    getRefreshToken,
    getUser,
    getUserFromClient,
    revokeAuthorizationCode,
    revokeToken,
    saveToken,
    saveAuthorizationCode,
    // validateScope,
    verifyScope
}