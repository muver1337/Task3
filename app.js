const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const fileUpload = require('express-fileupload')
const passport = require('passport')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const keys = require('./config/keys')
const session = require('express-session');
const checkSession = require('./middleware/checkSession');
const app = express()

mongoose.connect(keys.mongoURL)
    .then(() => console.log("MongoDB connected"))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(session({
    secret: 'session_root',
    resave: false,
    saveUninitialized: true
}));

app.use(fileUpload({}))
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api', authRoutes)

module.exports = app