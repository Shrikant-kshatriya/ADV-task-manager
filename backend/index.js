require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const db = require('./db.js');

// import routes
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

// importing middleware
const isAuth = require('./middleware/isAuth.js');

const app = express(); 

// database connection
db();

// cors setting
app.use(cors());

// middleware
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    maxAge: 10* 24 * 60 * 60 * 1000, // 10 days
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use('/auth', authRoutes);
app.use('/user', isAuth, userRoutes);
app.use('/task', isAuth, taskRoutes);

// server
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

 