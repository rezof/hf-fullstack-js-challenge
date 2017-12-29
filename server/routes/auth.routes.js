const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()

/**
 * validates register parameters
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const verifyRegister = (req, res, next) => {
  const { email, password, passwordConf } = req.body
  const errors = []

  // check email
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!(typeof email === 'string' && reg.test(email))) {
    errors.push('email is not valid')
  }

  // verify passwords
  if (!(typeof password === 'string' && password.length > 4)) {
    errors.push('password length must be at least 4 caracters')
  } else if (!(typeof passwordConf === 'string' && password === passwordConf)) {
    errors.push('passwords must match')
  }

  if (errors.length > 0) {
    res.statusCode = 400
    res.json({ success: false, errors })
  } else next()
}

router.post('/register', verifyRegister, authController.register)

module.exports = router
