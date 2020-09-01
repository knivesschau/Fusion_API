require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const fuseRouter = require('./fused_recipes/recipes-router');
const baseRouter = require('./base_recipes/base-router');
const cuisineRouter = require('./cuisines/cuisine-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const {NODE_ENV} = require('./config');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// landing page for API 
app.get('/', (req, res) => {
    res.send('Welcome to the Fusion API!')
});

// all API server routes 
app.use('/api/auth', authRouter); // authentication and login endpoint
app.use('/api/recipes', fuseRouter); // dyanmic endpoint, user created and generated recipes
app.use('/api/bases', baseRouter); // static endpoint, starter recipes for users
app.use('/api/cuisines', cuisineRouter); // static endpoint, cuisines for users
app.use('/api/users', usersRouter); // registration and user data endpoint

app.use(function errorHandler(error, req, res, next) {
    let response;

    if (NODE_ENV === 'production') {
        response = { error: {message: 'server error.'}};
    }
    else {
        console.error(error);
        response = {message: error.message, error};
    }
    res.status(500).json(response);
});

module.exports = app;