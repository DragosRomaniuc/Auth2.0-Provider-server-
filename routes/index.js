const router = require('express-promise-router')();
// const oauthMiddlewares = require('./oauthServerMiddlewares');
// const usersController = require('./controllers/users');
// const clientsController = require('./controllers/clients');

router.use('/client', require('./clientRoutes'));
router.use('/oauth', require('./oauthRoutes'));
router.use('/secure', require('./secureRoute'));


router.use('/', (req,res) => res.redirect('/client'));

module.exports = router;