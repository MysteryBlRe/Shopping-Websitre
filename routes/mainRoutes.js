const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

require('dotenv').config();
const jwtSign = process.env.JWTSIGN;

const User = require('../models/User')
const Order = require('../models/Order')

const authController = require('../controllers/authController');

router.get('*', authController.checkUser);
router.get('/', (req, res) => res.render('index'));
router.get('/profile', authController.requireAuth , (req, res) => {

    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, jwtSign, async (err, decodedToken) => {
            if (err){
                res.redirect('/')
                console.log(err.message);
            } else {
                let user = await User.findById(decodedToken.id);
                let orders = await Order.find({userid: user._id});
                res.render('profile', {orders});
            }
        })
    }else{
        res.redirect('/')
    }
});

module.exports = router;