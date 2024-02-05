const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');
const crypto = require('crypto');

const token = (payload, expiresIn) => {
    return jwt.sign(payload, keys.jwt, { expiresIn });
};

module.exports.login = async function (req, res) {
    try {
        const candidate = await User.findOne({ login: req.body.login });
        if (candidate) {
            const passwordResult = await bcrypt.compare(req.body.password, candidate.password);
            if (passwordResult) {
                const accessToken = token({ email: candidate.email, userId: candidate._id }, '10m');
                const refreshToken = token({ email: candidate.email, userId: candidate._id }, '11m');
                res.status(200).json({
                    message: 'Вход выполнен успешно',
                    tokens: {
                        AccessToken: accessToken,
                        RefreshToken: refreshToken
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

const fs = require('fs');

module.exports.register = async function (req, res) {
    try {
        const candidate = await User.findOne({ login: req.body.login });
        if (candidate) {
            return res.status(409).json({ message: 'Логин уже существуют в базе данных' });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const password = req.body.password;
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = new User({
                login: req.body.login,
                password: hashedPassword,
            });
            const savedUser = await newUser.save();

            const rootFolderPath = `./userFolder/${savedUser._id}`;
            fs.mkdirSync(rootFolderPath);

            res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
        }
    } catch (e) {
        errorHandler(res, e);
    }
};