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

/**
 * validates login parameters
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const verifyLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = []

  // check email
  if (typeof email !== 'string') {
    errors.push('email is required')
  }

  // verify password
  if (typeof password !== 'string') {
    errors.push('password is required')
  }

  if (errors.length > 0) {
    res.statusCode = 401
    res.json({ success: false, errors })
  } else next()
}

router.post('/register', verifyRegister, authController.register)
router.post('/login', verifyLogin, authController.login)

module.exports = router
