const express = require('express')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')
const shopController = require('../controllers/shop.controller')

const router = express.Router()

const verifyAuth = (req, res, next) => {
  var token =
    req.body.token ||
    req.query.token ||
    req.headers['authorization'] ||
    req.headers['x-access-token']
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        console.log(chalk.red('token not valid', err))
        res.statusCode = 401
        res.json({ errors: ['token not valid'] })
      } else {
        req.user = decoded
        next()
      }
    })
  } else {
    res.statusCode = 401
    res.json({ errors: ['authentification required!'] })
  }
}

router.get('/shops', verifyAuth, shopController.fetchAll)
router.post('/shop/like/:id', verifyAuth, shopController.likeShop)
router.post('/shop/unlike/:id', verifyAuth, shopController.unlikeShop)
router.post('/shop/dislike/:id', verifyAuth, shopController.dislikeShop)

module.exports = router
