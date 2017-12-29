const path = require('path')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// attache body parameters to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

// set static files route
app.use('/static', express.static(path.resolve(__dirname, 'public')))

// loads env variables into process.env
require('dotenv').config()

module.exports = app
