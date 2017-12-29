const UserModel = require('../models/user.model')
const chalk = require('chalk')

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
    (user, err) => {
      if (!err) {
        console.log(chalk.red('register error:', err))
        res.statusCode = 500
        res.json({ success: false, errors: ['failed to create user'] })
      } else res.json({ success: true })
    }
  )
}

const login = (req, res) => {
  const { email, password } = req.body
  UserModel.authenticate(email, password)
    .then(user => res.json({ success: true, user }))
    .catch(err => {
      res.statusCode = 401
      res.json({ success: false, errors: ['user not found'] })
    })
}

module.exports = {
  register,
  login
}
