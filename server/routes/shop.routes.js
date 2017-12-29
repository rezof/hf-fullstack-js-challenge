const express = require('express')
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
        res.statusCode = 401
        res.json({ errors: ['token not valid'] })
      } else next()
    })
  } else {
    res.statusCode = 401
    res.json({ errors: ['authentification required!'] })
  }
}

router.get('/shops', verifyAuth, shopController.fetchAll)

module.exports = router
