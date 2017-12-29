const jwt = require('jsonwebtoken')
const chalk = require('chalk')
const UserModel = require('../models/user.model')

const { JWT_SECRET } = process.env

/**
 * creates new user
 * @param req
 * @param res
 * @returns ex: {
 *    success: true/false,
 *    errors?: ['error message']
 * }
 */
const register = (req, res) => {
  const { email, password } = req.body
  UserModel.create(
    {
      email,
      password
    },
    (err, user) => {
      if (!err) {
        console.log(chalk.red('register error:', err))
        res.statusCode = 500
        res.json({ success: false, errors: ['failed to create user'] })
      } else res.json({ success: true })
    }
  )
}

const generateToken = user => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: 1440 // expires in a day
  })
}

const login = (req, res) => {
  const { email, password } = req.body
  UserModel.authenticate(email, password)
    .then(user => {
      const token = generateToken(user)
      res.json({ success: true, token })
    })
    .catch(err => {
      console.error('err', err)
      res.statusCode = 401
      res.json({ success: false, errors: ['user not found'] })
    })
}

module.exports = {
  register,
  login
}
