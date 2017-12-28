const express = require('express')
const app = express()
const mongoose = require('mongoose')
const chalk = require('chalk')

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

app.listen(PORT, () => {
  console.log(chalk.green(`listening on port ${PORT}`))
})
