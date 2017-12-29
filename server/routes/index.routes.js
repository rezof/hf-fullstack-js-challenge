const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')

router.get('/', (req, res) => {
  res.sendfile(path.resolve(__dirname, '../../public/index.html'))
})

router.use('/', authRoutes)

module.exports = router
