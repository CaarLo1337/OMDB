const router = require('express').Router();
const profileController = require('../controllers/profile.controller');
const verifyService = require('../services/verify.service');

// - userprofilpage -
router
    .route('/')
    .get(
        verifyService,
        profileController.profile_get);

module.exports = router;