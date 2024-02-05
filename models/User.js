const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        required: true,
        // match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,}$/
    }
})

module.exports = mongoose.model('users', userSchema)