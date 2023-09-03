const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

//Routes
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes')
const mainRoutes = require('./routes/mainRoutes')

//Middleware

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

//Connect to database

const dbURI = process.env.DBURI;

mongoose.connect(dbURI)
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

app.use(mainRoutes)
app.use(authRoutes)
app.use(adminRoutes)
app.use(categoriesRoutes)

app.get('*', (req, res) => {
    res.redirect('/')
})