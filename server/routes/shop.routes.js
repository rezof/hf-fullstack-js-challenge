const express = require('express')
const chalk = require('chalk')
const shopController = require('../controllers/shop.controller')

const router = express.Router()

router.get('/shops', shopController.verifyAuth, shopController.fetchAll)
router.post(
  '/shop/like/:id',
  shopController.verifyAuth,
  shopController.likeShop
)
router.post(
  '/shop/unlike/:id',
  shopController.verifyAuth,
  shopController.unlikeShop
)
router.post(
  '/shop/dislike/:id',
  shopController.verifyAuth,
  shopController.dislikeShop
)

module.exports = router
