const path = require('path')
const express = require('express')
const chalk = require('chalk')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

// attache body parameters to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  next()
})

// set static files route
app.use('/static', express.static(path.resolve(__dirname, 'public')))

// loads env variables into process.env
require('dotenv').config()

if (!process.env.JWT_SECRET) {
  throw new Error(
    chalk.red('looks like you forgot to set JWT_SECRET on the .env file')
  )
}

if (!process.env.JWT_LIFESPAN) {
  throw new Error(
    chalk.red('looks like you forgot to set JWT_LIFESPAN on the .env file')
  )
}

module.exports = app
