const router = require('express-promise-router')();

router.route('/').get((req,res) => {  // Successfully reached if can hit this :)
    res.json({success: true});
  })

module.exports = router;