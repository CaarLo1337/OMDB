const router = require('express').Router();
const verify = require('../services/verify.service');

router.get('/', verify,(req, res) => {
    res.render('profile.ejs')
});

module.exports = router;