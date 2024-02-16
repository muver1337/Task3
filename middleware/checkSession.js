const mongoose = require('mongoose')
const express = require('express');
const app = express();
const User = mongoose.model('users')
const keys = require('../config/keys')
const session = require('express-session');

const checkSession = (req, res, next) => {
    if (req.session && req.session.login) {
        next();
    } else {
        res.status(401).json({ message: 'Необходимо выполнить вход' });
    }
};

