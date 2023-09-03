const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.get('*', authController.checkUser);
router.get('/', (req, res) => res.render('index'));

module.exports = router;