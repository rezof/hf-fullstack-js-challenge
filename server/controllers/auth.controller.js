const jwt = require('jsonwebtoken')
const chalk = require('chalk')
const UserModel = require('../models/user.model')

const { JWT_SECRET, JWT_LIFESPAN } = process.env

const generateToken = user => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: parseInt(JWT_LIFESPAN) // expiration in seconds
  })
}

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
  UserModel.checkEmail(email)
    .then(user => {
      if (!user) {
        UserModel.create(
          {
            email,
            password
          },
          (err, user) => {
            if (err) {
              console.log(chalk.red('register error:', err))
              throw new Error('failed to create user') // let catch handler response
            } else {
              const { email, _id: id } = user
              const token = generateToken({ email, id })
              res.json({ success: true, token })
            }
          }
        )
      } else {
        res.statusCode = 409
        res.json({ success: false, errors: ['email already exists'] })
      }
    })
    .catch(() => {
      res.statusCode = 500
      res.json({ success: false, errors: ['failed to create user'] })
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
