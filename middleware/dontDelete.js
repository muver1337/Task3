const mongoose = require('mongoose')
const express = require('express');
const app = express();
const User = mongoose.model('users')
const keys = require('../config/keys')
const session = require('express-session');
const blockRootFolderChanges = (req, res, next) => {
    const folderId = req.params.folderId; // предполагается, что идентификатор папки передается в параметрах запроса
    const userRootFolder = path.join('userFolder', `root_(${req.session.login})`); // предполагается, что информация о текущем пользователе сохранена в сессии

    if (folderId === userRootFolder) { // проверяем идентификатор папки с корневой папкой пользователя
        return res.status(403).json({ message: 'Нельзя удалять или редактировать корневую папку' });
    } else {
        next(); // если папка не является корневой, продолжаем выполнение следующего middleware
    }
};

module.exports = {
    blockRootFolderChanges
};