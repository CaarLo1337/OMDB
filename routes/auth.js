const router = require('express').Router();
const authController = require('../controllers/authController');

// - register -
router
    .route('/register')
    .get(authController.register_get)
    .post(authController.register_post);

// - login - 
router
    .route('/login')
    .get(authController.login_get)
    .post(authController.login_post);

router
    .route('/logout')
    .get(authController.logout_get);

module.exports = router; 