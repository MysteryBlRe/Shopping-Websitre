const jwt = require('jsonwebtoken');

require('dotenv').config();
const jwtSign = process.env.JWTSIGN;

const User = require('../models/User')

//Routes protection

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, jwtSign, async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.redirect('/login')
            } else {
                next();
            }
        })
    }else{
        res.redirect('/login')
    }
}

const requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, jwtSign, async (err, decodedToken) => {
            let user = await User.findById(decodedToken.id);
            if(user.role != 'admin')
                res.redirect('/');
            else
                next();
        })
    }else{
        res.redirect('/');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, jwtSign, async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

//Pages
const loginPage = (req, res) => {
    res.render('login');
}

const registerPage = (req, res) => {
    res.render('register');
}

//Register and login (POST)

const createToken = (id) => {
    return jwt.sign({ id }, jwtSign, {
        expiresIn: 60 * 60 * 24 * 365 * 100
    });
}

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: ''};

    if(err.code === 11000){
        errors.email = "This Email is already in use";
        return errors;
    }

    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

const userRegistration = async (req, res) => {
    const {email, name ,password} = req.body;

    try {
        const user = await User.create({email, name, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 * 100 });
        res.status(201).json({user: user._id});
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const userLogin = async (req, res) => {
    const {email, password} = req.body;

    try{
        let errors = {email: '', password: ''};
        const user = await User.findOne({email});
        if(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(email) == false){
            errors.email = "Please enter a valid Email";
            return res.status(400).json({errors});
        }
        if(!user){
            errors.email = "This Email isn't registered";
            return res.status(400).json({errors});
        }
        if(password != user.password){
            errors.password = "Incorrect password";
            return res.status(400).json({errors});
        }
    
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 * 100});
        res.status(200).json({user: user._id});
    } catch (err){
        console.log(err);
    }
}

const userLogout = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/')
}

module.exports = {
    requireAuth,
    requireAdmin,
    checkUser,
    userRegistration,
    userLogin,
    loginPage,
    registerPage,
    userLogout
}