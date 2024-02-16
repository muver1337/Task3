const express = require('express');
const authController = require('../controllers/UserController');
const folderController = require('../controllers/FolderController');
const fileController = require('../controllers/FileController');
const dontDelete = require('../middleware/dontDelete')
const router = express.Router();
const user = require('../models/User');



router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);


router.get('/:foldername', folderController.viewFolder)
router.post('/create-folder', folderController.createUserFolder)
router.post('/:foldername/update', folderController.renameFolder)
router.post('/:foldername/move', folderController.moveFolder)


router.post('/:foldername/create', fileController.uploadFile)
router.delete('/:filename/deletefile', fileController.deleteFile)

module.exports = router;