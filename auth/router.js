
'use strict';

// imports
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// setup
const config = require('../config');
const router = express.Router();

// Helper functions

const createAuthToken = function(user) {
    return jwt.sign({user}, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

// Routing

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

// Initial request for a JWT. 
router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
});



//export
module.exports = {router};