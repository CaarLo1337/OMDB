const router = require('express').Router();
const profileController = require('../controllers/profile.controller');
const verifyService = require('../services/verify.service');

// - profilpage -
router
    .route('/profile')
    .get(
        verifyService.verify,
        profileController.profile_get);

module.exports = router;