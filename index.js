const path = require('path')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const chalk = require('chalk')
const webpack = require('webpack')

const config = require('./client/webpack.config.js')
var compiler = webpack(config)
compiler.run(function(err, stats) {
  if (err || stats.hasErrors()) {
    throw new Error(chalk.red('webpack build failed'))
  }
  console.log('webpack build finished')
})

// set static files route
app.use('/static', express.static(path.resolve(__dirname, 'public')))

// loads env variables into process.env
require('dotenv').config()

const { PORT = 3000, MONGO_DB_URI } = process.env
if (!MONGO_DB_URI) {
  throw new Error(
    chalk.red(
      `you forgot to add MONGO_DB_URI to the .env file, see .env.example`
    )
  )
}

// connect to mongo db
mongoose.connect(MONGO_DB_URI)
mongoose.connection.on('error', () => {
  throw new Error(chalk.red(`unable to connect to database: ${MONGO_DB_URI}`))
})

app.get('/', (req, res) => {
  res.sendfile(path.resolve(__dirname, 'public/index.html'))
})

app.listen(PORT, () => {
  console.log(chalk.green(`listening on port ${PORT}`))
})
