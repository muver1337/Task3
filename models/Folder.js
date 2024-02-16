const mongoose = require("mongoose");
const Schema = mongoose.Schema

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    parentId : {
        type: Schema.Types.ObjectId,
        ref: 'Root',
        required: false,
    },

});

module.exports = mongoose.model('folders', folderSchema)