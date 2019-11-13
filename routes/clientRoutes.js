const router = require('express-promise-router')();
const path = require('path');

router.route('/').get((req,res) => res.sendFile(path.join(__dirname, '../public/clientAuthenticate.html')))



router.route('/app').get((req,res) => res.sendFile(path.join(__dirname, '../public/clientApp.html')))
router.route('/clientAuthenticate').get((req,res) => res.sendFile(path.join(__dirname, '../public/clientAuthenticate.html')))


module.exports = router;