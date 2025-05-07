require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const db = require('./db.js');
const { initSocket } = require('./socket');

// import routes
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

// importing middleware
const isAuth = require('./middleware/isAuth.js');

const app = express(); 
const server = http.createServer(app);

// database connection
db();

// cors setting
app.use(cors({
    origin: [process.env.CLIENT_URL, '*'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
    
}));

// middleware
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    maxAge: 10* 24 * 60 * 60 * 1000, // 10 days
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use('/auth', authRoutes);
app.use('/user', isAuth, userRoutes);
app.use('/task', isAuth, taskRoutes);

// initialize socket
initSocket(server);

// server listen
server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
