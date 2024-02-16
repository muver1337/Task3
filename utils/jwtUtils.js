const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports.generateAccessToken = function (payload, expiresIn) {
    return jwt.sign(payload, keys.jwt, { expiresIn });
}

module.exports.verifyToken = function (token, secret) {
    return jwt.verify(token, secret);
}