const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtUtils = require('../utils/jwtUtils');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');
const crypto = require('crypto');
const session = require('express-session');
const fs = require('fs');

const token = (payload, expiresIn) => {
    return jwt.sign(payload, keys.jwt, { expiresIn });
};

let activeTokens = [];


module.exports.login = async function (req, res) {
    try {
        const candidate = await User.findOne({ login: req.body.login });
        if (candidate) {
            const passwordResult = await bcrypt.compare(req.body.password, candidate.password);
            if (passwordResult) {
                const accessToken = jwtUtils.generateAccessToken({ email: candidate.email, login: candidate.login }, '10m');
                const refreshToken = jwtUtils.generateAccessToken({ email: candidate.email, login: candidate.login }, '11m');
                req.session.login = req.body.login;
                res.status(200).json({
                    message: `Вход выполнен успешно, ${req.session.login}`,
                    tokens: {
                        AccessToken: accessToken,
                        RefreshToken: refreshToken,
                    }
                });
            } else {
                res.status(401).json({ message: 'Пароль не совпадает' });
            }
        } else {
            res.status(404).json({ message: 'Пользователь не найден' });
        }
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.logout = function (req, res) {
    if (!req.session.login) {
        return res.status(401).json({ message: 'Нет активного пользователя' });
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.body.refreshToken;

    if (activeTokens.includes(accessToken)) {
        activeTokens = activeTokens.filter(token => token !== accessToken);
    }
    if (activeTokens.includes(refreshToken)) {
        activeTokens = activeTokens.filter(token => token !== refreshToken);
    }
    req.session.destroy();

    res.status(200).json({ message: 'Выход выполнен успешно' });
};


module.exports.register = async function (req, res) {
    try {
        const candidate = await User.findOne({ login: req.body.login });
        if (candidate) {
            return res.status(409).json({ message: 'Логин уже существует в базе данных' });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const password = req.body.password;
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = new User({
                login: req.body.login,
                password: hashedPassword,
            });
            const savedUser = await newUser.save();

            const rootFolderPath = `./userFolder/root_(${savedUser.login})`;
            fs.mkdirSync(rootFolderPath);

            res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
        }
    } catch (e) {
        errorHandler(res, e);
    }

};