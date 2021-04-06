const router = require('express').Router();
const homeController = require('../controllers/home.controller');

// - home -
router
    .route('/')
    .get(homeController.home_get);

// - results -

router
    .route('/results/page=:page')
    .get(homeController.results_get);

module.exports = router; 