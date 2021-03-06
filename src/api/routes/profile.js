const router = require('express').Router();
const verify = require('../helpers/verifyToken');

router.get('/', verify,(req, res) => {
    res.render('profile.ejs')
});

module.exports = router;