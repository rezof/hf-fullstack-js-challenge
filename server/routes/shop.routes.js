const express = require('express')
const shopController = require('../controllers/shop.controller')

const router = express.Router()

router.get('/shops', shopController.fetchAll)

module.exports = router
