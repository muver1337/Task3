const mongoose = require("mongoose");
const Schema = mongoose.Schema

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 4,
    },
    filePath: {
        type: String,
        minlength: 4,
    },
    folderId: {
        type: Schema.Types.ObjectId,
        ref: 'Root',
    },

});

module.exports = mongoose.model('files', fileSchema)