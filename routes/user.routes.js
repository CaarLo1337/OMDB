const router = require('express').Router();
const userController = require('../controllers/user.controller');
const verifyService = require('../services/verify.service');

// userpage for admin only
router
    .route('/user')
    .get(
        verifyService,
        userController.user_get
        );

module.exports = router;