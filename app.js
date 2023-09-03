const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();

//Middleware

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs')

//Connect to database

const dbURI = process.env.DBURI;
const jwtSign = process.env.JWTSIGN;

mongoose.connect(dbURI)
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

//Protect routes from users that aren't logged in
function requireAuth(req, res, next){
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

function requireAdmin(req, res, next){
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

//Check if a user is logged in every page
app.get('*', (req, res, next) => {
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
})

//Rendering pages


app.get('/', (req, res) => res.render('index'));


//Categories page

const Category = require('./models/Category')

app.get('/categories', requireAuth , async (req, res) => {
    const categories = await Category.find({});
    res.render('categories', {categories})
})

//The products page based on the category

const Product = require('./models/Product');

app.get('/category/:id', async (req, res) => {
    let categoryId = req.params.id;

    const products = await Product.find({category : categoryId});

    res.render('category', {categoryId, products});
})

app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/admin', requireAdmin, (req, res) => res.render('admin'));
app.get('/admin/*', requireAdmin);
app.get('/admin/product', async (req, res) => {

    const categories = await Category.find();

    res.render('productsubmit', {categories})
})

//Logout
app.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/')
})

//Submit Product


app.post('/admin/product', async (req, res) => {

    const name = req.body.name;
    const category = req.body.category;
    const image = req.body.image;

    try {
        await Product.create({name, category, image});
        res.status(200).json({image});
    } catch (err) {
        console.log(err);
        res.status(400);
    }
})


//Create jwt token
const createToken = (id) => {
    return jwt.sign({ id }, jwtSign);
}

//Hnadling auth post requests

const User = require('./models/User')

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

app.post('/register', async (req, res) => {

    const {email, name ,password} = req.body;

    try {
        const user = await User.create({email, name, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true});
        res.status(201).json({user: user._id});
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
})

app.post('/login', async (req, res) => {

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
        res.cookie('jwt', token, { httpOnly: true});
        res.status(200).json({user: user._id});
    } catch (err){
        console.log(err);
    }
})

app.get('*', (req, res) => {
    res.redirect('/')
})