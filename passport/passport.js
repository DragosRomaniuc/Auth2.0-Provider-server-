// const passport = require('passport');
// const axios = require('axios');
// const refresh = require('passport-oauth2-refresh');
// const url = require('url');
// const fs = require('fs');
// const path = require('path');
// const { Strategy: LocalStrategy } = require('passport-local');
// const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
// const { Strategy: LinkedInStrategy } = require('passport-linkedin-oauth2');
// const { Strategy: AzureStrategy } = require('passport-azure-ad-oauth2');
// const KeycloakStrategy = require('@exlinc/keycloak-passport');
// const SamlStrategy = require('passport-saml').Strategy;
// const OAuth2Strategy = require('passport-oauth2').Strategy;
// const jwt = require('jsonwebtoken');
// const _ = require('lodash');
// const moment = require('moment');
// const User = require('../GraphQL/models/user');
// const callbackBaseUrl = process.env.CALLBACK_BASE_URL || `http://localhost:3001/`;
// require('https').globalAgent.options.rejectUnauthorized = false;

// passport.serializeUser((user, done) => {
//   console.log('am serializat')
//     done(null, user.id);
//   });

// passport.deserializeUser((id, done) => {
//     console.log('am deserializat')
//     User.findById(id, (err, user) => {
//       done(err, user);
//     });
//   });

//   // passport.use(new OAuth2Strategy(
//   //   {
//   //     authorizationURL: process.env.OAUTH_AUTH_URL,
//   //     tokenURL: process.env.OAUTH_TOKEN_URL,
//   //     clientID: process.env.OAUTH_CLIENT_ID || null,
//   //     clientSecret: process.env.OAUTH_CLIENT_SECRET || null,
//   //     callbackURL: url.resolve(callbackBaseUrl, 'auth/adfs/callback'),
//   //     passReqToCallback: true,
//   //   },
//   //   function(req, accessToken, refreshToken, params, profile, done) {
//   //     let user = {};
//   //     if (typeof req.user !== 'undefined') {
//   //       // Reuse the existing user from the SAML login
//   //       user = req.user;
//   //     }
//   //     user.oauth2 = profile;
//   //     user.oauth2.accessToken = accessToken;
//   //     user.oauth2.params = params;
//   //     user.oauth2.refreshToken = refreshToken;
//   //     done(null, user);
//   //   }
//   // ));


// const googleStrategyConfig = new GoogleStrategy({
//   clientID: process.env.GOOGLE_ID,
//   clientSecret: process.env.GOOGLE_SECRET,
//   callbackURL: '/auth/google/callback',
//   passReqToCallback: true
// }, async (req, accessToken, refreshToken, params, profile, done) => {
//   try {
//     if(req.user) {
//     //   let user = await User.findOne({
//     //     google: profile.id
//     //   });

//     //   if(user && user.id !== req.user.id) {
//     //     req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.'})
//     //     return done(null);
//     //   } else {
//     //     let user = await User.findById(req.user.id);
//     //     user.google = profile.id;
//     //     user.tokens.push({
//     //       kind: 'google',
//     //       accessToken,
//     //       accessToken: moment().add(params.expires_in, 'seconds').format(),
//     //       refreshToken
//     //     });
//     //     user.profile.name = user.profile.name || profile.displayName;
//     //     user.profile.gender = user.profile.gender || profile._json.gender;
//     //     user.profile.picture = user.profile.picture || profile._json.picture;
//     //     await user.save();
//     //     req.flash('info', { msg: 'Google account has been linked.' });
//     //     done(null, user);
//     //   }

//     } else {
//       let user = await User.findOne({ google: profile.id });
//       if(user) {
//         return done(null, user);
//       }
//         user = new User();
//         user.email = profile.emails[0].value;
//         user.google = profile.id;
//         user.tokens.push({
//             kind: 'google',
//             accessToken,
//             accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
//             refreshToken,
//           });
//         user.profile.name = profile.displayName;
//         user.profile.gender = profile._json.gender;
//         user.profile.picture = profile._json.picture;
//         await user.save();


//     }
//   } catch (error) {
//     done(err);
//   }

// });

// passport.use('google', googleStrategyConfig);
// refresh.use('google', googleStrategyConfig);

// const AzureOauthStrategy = new AzureStrategy({
//   clientID: process.env.MICROSOFT_APPLICATIONID,
//   clientSecret: process.env.MICROSOFT_SECRET,
//   callbackURL: '/auth/microsoft/callback',
//       passReqToCallback: true
// }, async (req, accessToken, refreshToken, params, profile, done) => {
//   const waadProfile = await jwt.decode(params.id_token);
//   try {
//     if(req.user) {
//       let user = await User.findOne({
//         microsoft: waadProfile.sub
//       });

//       if(user && user.id !== req.user.id) {
//         req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.'})
//         return done(null);
//       } else {
//         let user = await User.findById(req.user.id);
//         user.microsoft = waadProfile.sub;
//         user.tokens.push({
//           kind: 'waadProfile',
//           accessToken,
//           accessToken: moment().add(params.expires_in, 'seconds').format(),
//           refreshToken
//         });
//         user.profile.name = user.profile.name || waadProfile.name;
//         // user.profile.gender = user.profile.gender || profile._json.gender;
//         // user.profile.picture = user.profile.picture || profile._json.picture;
//         await user.save();
//         req.flash('info', { msg: 'Google account has been linked.' });
//         done(null, user);
//       }

//     } else {
//       let user = await User.findOne({ microsoft: waadProfile.sub });
//       if(user) {
//         return done(null, user);
//       }
//       user = await User.findOne({ email: waadProfile.email});
//       if(user) {
//         req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
//         done(null);
//       } else {
//         user = new User();
//         user.email = waadProfile.email;
//         user.microsoft = waadProfile.sub;
//         user.tokens.push({
//           kind: 'microsoft',
//           accessToken,
//           accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
//           refreshToken,
//         });
//         user.profile.name = waadProfile.name;
//         await user.save();
//       }

//     }
//   } catch (error) {
//     done(err);
//   }
//     }
// )

// passport.use('microsoft', AzureOauthStrategy);
// refresh.use('microsoft', AzureOauthStrategy);

// passport.use(new LinkedInStrategy({
//   clientID: process.env.LINKEDIN_ID,
//   clientSecret: process.env.LINKEDIN_SECRET,
//   callbackURL: '/auth/linkedin/callback',
//   scope: ['r_liteprofile', 'r_emailaddress'],
//   passReqToCallback: true
// }, (req, accessToken, refreshToken, profile, done) => {

//   if (req.user) {
//     User.findOne({ linkedin: profile.id }, (err, existingUser) => {
//       if (err) { return done(err); }
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         done(err);
//       } else {
//         User.findById(req.user.id, (err, user) => {
//           if (err) { return done(err); }
//           user.linkedin = profile.id;
//           user.tokens.push({ kind: 'linkedin', accessToken });
//           user.profile.name = user.profile.name || profile.displayName;
//           user.profile.picture = user.profile.picture || profile.photos[3].value;
//           user.save((err) => {
//             if (err) { return done(err); }
//             req.flash('info', { msg: 'LinkedIn account has been linked.' });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ linkedin: profile.id }, (err, existingUser) => {
//       if (err) { return done(err); }
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
//         if (err) { return done(err); }
//         if (existingEmailUser) {
//           req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with LinkedIn manually from Account Settings.' });
//           done(err);
//         } else {
//           const user = new User();
//           user.linkedin = profile.id;
//           user.tokens.push({ kind: 'linkedin', accessToken });
//           user.email = profile.emails[0].value;
//           user.profile.name = profile.displayName;
//           user.profile.picture = user.profile.picture || profile.photos[3].value;
//           user.save((err) => {
//             done(err, user);
//           });
//         }
//       });
//     });
//   }
// }));

// module.exports = {
//     isAuthenticated: (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect('/login');
//   },

//     isAuthorized : (req, res, next) => {
//     const provider = req.path.split('/')[2];
//     const token = req.user.tokens.find((token) => token.kind === provider);
//     if (token) {
//       // Is there an access token expiration and access token expired?
//       // Yes: Is there a refresh token?
//       //     Yes: Does it have expiration and if so is it expired?
//       //       Yes, Quickbooks - We got nothing, redirect to res.redirect(`/auth/${provider}`);
//       //       No, Quickbooks and Google- refresh token and save, and then go to next();
//       //    No:  Treat it like we got nothing, redirect to res.redirect(`/auth/${provider}`);
//       // No: we are good, go to next():
//       if (token.accessTokenExpires && moment(token.accessTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
//         if (token.refreshToken) {
//           if (token.refreshTokenExpires && moment(token.refreshTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
//             res.redirect(`/auth/${provider}`);
//           } else {
//             refresh.requestNewAccessToken(`${provider}`, token.refreshToken, (err, accessToken, refreshToken, params) => {
//               User.findById(req.user.id, (err, user) => {
//                 user.tokens.some((tokenObject) => {
//                   if (tokenObject.kind === provider) {
//                     tokenObject.accessToken = accessToken;
//                     if (params.expires_in) tokenObject.accessTokenExpires = moment().add(params.expires_in, 'seconds').format();
//                     return true;
//                   }
//                   return false;
//                 });
//                 req.user = user;
//                 user.markModified('tokens');
//                 user.save((err) => {
//                   if (err) console.log(err);
//                   next();
//                 });
//               });
//             });
//           }
//         } else {
//           res.redirect(`/auth/${provider}`);
//         }
//       } else {
//         next();
//       }
//     } else if (req.user && req.user.method == 'saml') {
//       next();
//     } else {
//       res.redirect(`/login`);
//     }
//   }
// }