const path = require('path')
const chalk = require('chalk')
const mongoose = require('mongoose')
const webpack = require('webpack')
const app = require('./server/config')
const routes = require('./server/routes/index.routes')
const config = require('./client/webpack.prod.js')

const compiler = webpack(config)
compiler.run(function(err, stats) {
  if (err || stats.hasErrors()) {
    throw new Error(chalk.red('webpack build failed'))
  }
  console.log('webpack build finished')
})

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

app.use('/', routes)

app.listen(PORT, () => {
  console.log(chalk.green(`listening on port ${PORT}`))
})
