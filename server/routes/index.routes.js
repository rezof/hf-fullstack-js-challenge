const path = require('path')
const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')
const shopRoutes = require('./shop.routes')

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/index.html'))
})

router.use('/', authRoutes)
router.use('/', shopRoutes)

router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/index.html'))
})

module.exports = router
