    const bcrypt = require('bcryptjs');
    const jwtUtils = require('../utils/jwtUtils');
    const jwt = require('jsonwebtoken');
    const nodemailer = require('nodemailer');
    const User = require('../models/User');
    const Folder = require('../models/Folder');
    const File = require('../models/File');
    const keys = require('../config/keys');
    const errorHandler = require('../utils/errorHandler');
    const crypto = require('crypto');
    const fs = require('fs');
    const path = require('path');
    const session = require('express-session');

    const checkSession = (req, res, next) => {
        if (req.session && req.session.login) {
            next();
        } else {
            res.status(401).json({ message: 'Необходимо выполнить вход' });
        }
    };

    module.exports.createUserFolder = async function (req, res) {
        try {
            checkSession(req, res, () => {
                const userRootFolder = path.join('userFolder', `root_(${req.session.login})`);
                const newFolderName = req.body.name;
                const newFolderPath = path.join(userRootFolder, newFolderName);
                if (!fs.existsSync(newFolderPath)) {
                    fs.mkdirSync(newFolderPath, { recursive: true });
                    res.status(201).json({ message: 'Папка успешно создана' });
                } else {
                    res.status(409).json({ message: 'Папка уже существует' });
                }
            });
        } catch (error) {
            errorHandler(res, error);
        }
    };

    module.exports.viewFolder = async function (userId, folderId) {
        try {
            const folder = await Folder.findOne({ userId: userId, _id: folderId });
            if (!folder) {
                return { message: 'Папка не найдена' };
            }
            const files = await File.find({ folderId: folderId });
            return { folder, files };
        } catch (error) {
            console.error('Ошибка просмотра папки:', error);
            return { error: 'Ошибка при просмотре содержимого папки' };
        }
    }

    module.exports.renameFolder = async function (req, res) {
        const folderId = req.params.folderId; // Получаем идентификатор папки из параметров запроса
        const newName = req.body.newName; // Получаем новое название из тела запроса

        try {
            const updatedFolder = await Folder.findByIdAndUpdate(folderId, { name: newName }, { new: true });
            if (updatedFolder) {
                return res.status(200).json(updatedFolder);
            } else {
                return res.status(404).json({ message: 'Папка не найдена' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Ошибка при переименовании папки', error: error.message });
        }
    };

    module.exports.moveFolder = async function (folderId, newParentId) {
        const movedFolder = await Folder.findByIdAndUpdate(folderId, { parentId: newParentId }, { new: true });
        return movedFolder;
    }