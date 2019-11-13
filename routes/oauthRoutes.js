const router = require('express-promise-router')();
const path = require('path');
const oauthServer = require('../oauth/server');
const db = require('./../database/index');
const OAuthClient = db.OAuthClient;
const OAuthUser = db.User;
const RegisteredEntity = db.RegisteredEntity;
const filePath = path.join(__dirname, '../public/oauthAuthenticate.html');
// var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
// const passport = require('passport');


router.route('/').get((req,res) => {  // send back a simple form for the oauth
  res.sendFile(filePath)
})

router.post('/createClient', async (req, res, next) => {

  // name: String,
  //   clientId: {type: String, required: true},
  //   clientSecret: String,
  //   redirectUris: { 
  //       type: [String]
  //   },
  //   grants: {
  //       type: [String],
  //       default: ['authorization_code', 'password', 'refresh_token', 'client_credentials']
  //   }
  try {
    let client = await OAuthClient.create({
    name: req.body.clientName,
    clientId: req.body.clientId,
    clientSecret: req.body.clientSecret,
    redirectUris: ['http://localhost:3001/client/app'],
    grants: ['authorization_code', 'refresh_token']
  });

  let registeredEntity = !! await RegisteredEntity.findOneAndUpdate({
    name: req.body.entityName
  },{
    name: req.body.entityName,
    domain: req.body.domainName,
    $push : {
      'client' : client._id
    }
  },{
    upsert: true
  });

  res.json({...client, ...registeredEntity});
} catch (error) {
  console.log(error);
  res.json(error);
}
});

router.post('/checkEmail', async (req, res, next) => {

  try {
    // console.log(req.body)
    const { email } = req.body;
    console.log(email.split('@')[1]);
    let entity = await RegisteredEntity.findOne({
      domain: email.split('@')[1]
    })
    .select('-_id domain name')
    .lean();

    console.log(entity, 'entity')

  if(entity){
    res.json({
    data: entity
  });
} else {
  res.json({
    data: null
  })
}
} catch (error) {
  res.send(error);
}

 
});

router.post('/createUser', async (req, res, next) => {

  // name: String,
  //   clientId: {type: String, required: true},
  //   clientSecret: String,
  //   redirectUris: { 
  //       type: [String]
  //   },
  //   grants: {
  //       type: [String],
  //       default: ['authorization_code', 'password', 'refresh_token', 'client_credentials']
  //   }
  let user = await OAuthUser.create({
    username: req.body.username,
    password: req.body.password
  });



  res.json(user);
});





























router.post('/authorize', async (req,res,next) => {
  console.log('req body is authorize', req.body);
  const {username, password} = req.body;

  if(username && password){
    let user = await OAuthUser
    .findOne({ username, password })
    .lean();
    req.body.user = user;
    return next();
  }

  // Daca gaseste USERNAME si PASSWORD trece in urmatorul middleware cu 
  // req.body = client_id: 'firstClientId',
  // redirect_uri: 'http://localhost:3001/client/app',
  // response_type: 'code',
  // grant_type: 'authorization_code',
  // state: 'myState',
    //  user: {
    //    datele userului
    //  }


  // Daca nu gaseste USERNAME si PASSWORD mapeaza parametrii din request si face redirect inapoi catre /oauth 
  // cu success=false&client_id=firstClientId&redirect_uri=http://localhost:3001/client/app&response_type=code&grant_type=authorization_code&state=myState

    const params = [ // Send params back down
      'client_id',
      'redirect_uri',
      'response_type',
      'grant_type',
      'state',
    ]
      .map(a => `${a}=${req.body[a]}`)
      .join('&')
    return res.redirect(`/oauth?success=false&${params}`)
  }, (req,res, next) => { // sends us to our redirect with an authorization code in our url
    // Daca gaseste userul trece aici cu 
    // {
    //   client_id: 'firstClientId',
    //   redirect_uri: 'http://localhost:3001/client/app',
    //   response_type: 'code',
    //   grant_type: 'authorization_code',
    //   state: 'myState',
    //   username: 'dragos',
    //   password: 'dragospassword',
    //   user: {
    //     _id: 5dc019cf9aea562ddc37eee3,
    //     username: 'dragos',
    //     password: 'dragospassword',
    //     __v: 0
    //   }
    // }
    return next()
  }, oauthServer.authorize({
    // apeleaze pe rand : 1) getClient 2) saveAuthorizationCode 3) returneaza Promise cu saveAuthCode 
    authenticateHandler: {
      handle: req => {
        return req.body.user
      }
    }
  }))

router.route('/token').post(oauthServer.token({
  requireClientAuthentication: { // whether client needs to provide client_secret
    'authorization_code': true
  },
}));



module.exports = router;