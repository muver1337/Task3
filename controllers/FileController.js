const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const config = require('../config/keys');
const errorHandler = require('../utils/errorHandler');
const crypto = require('crypto');
const fs = require('fs');
const Folders = require('../models/Folder');
const File = require("../models/File");


module.exports.uploadFile = async function (req, res) {
    try {
        const file = req.files.file;
        const root = await File.findOne({ user: req.user.id, _id: req.body.root });

        let path;
        if (root) {
            path = `./userFolder/root_${req.user.login}/${file.name}`; // Использование логина пользователя для формирования пути к файлу
        } else {
            return res.status(400).json({ message : "Корневая папка не найдена" });
        }

        if (fs.existsSync(path)) {
            return res.status(400).json({ message : "Файл уже найден" });
        }

        file.mv(path);

        const dbFile = new File({
            name: file.name,
            filepath: path,
            folderId: req.body.root,
        });

        const newFile = await dbFile.save();

        return res.status(200).json({ message: 'Файл успешно загружен', file: newFile });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Ошибка загрузки файла" });
    }
};

module.exports.deleteFile = async function (fileId, accessToken) {
    try {
        const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        const userId = decodedToken.user._id;

        const file = await File.findOne({ _id: fileId });

        if (!file) {
            throw new Error('Файл не найден');
        }

        // Проверяем, что используем правильный путь к файлу для удаления
        const filePath = `${config.get('filePath')}\\${userId}\\${file.name}`;

        const folder = await Folders.findOne({ _id: file.folderId, userId: userId });

        if (!folder) {
            throw new Error('Доступ запрещен');
        }

        await File.deleteOne({ _id: fileId });
        fs.unlink(filePath, (err) => { // Используем правильный путь к файлу для удаления
            if (err) {
                throw err;
            }
            console.log('Файл успешно удален');
        });

        return file;
    } catch (error) {
        console.error('Ошибка при удалении файла:', error);
        return { error: 'Ошибка при удалении файла' };
    }
};