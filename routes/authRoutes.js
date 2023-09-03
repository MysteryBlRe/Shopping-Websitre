const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.get('/login', authController.loginPage);
router.get('/register', authController.registerPage);
router.get('/logout', authController.userLogout)

router.post('/register', authController.userRegistration)
router.post('/login', authController.userLogin);

module.exports = router;