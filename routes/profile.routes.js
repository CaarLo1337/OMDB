const router = require('express').Router();
const profileController = require('../controllers/profile.controller');
const verifyService = require('../services/verify.service');
const profilData = require('../services/profiledata.services');

// - profilpage -
router
    .route('/profile')
    .get(
        verifyService.verify,
        profilData.getUserData,
        profileController.profile_get);

module.exports = router;