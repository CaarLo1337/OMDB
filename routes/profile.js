const router = require('express').Router();
const verify = require('../controllers/verifyToken');

router.get('/', verify,(req, res) => {
    res.render('profile.ejs')
});

module.exports = router;