const jwt = require('jsonwebtoken')
const { GraphQLID, GraphQLNonNull, GraphQLString } = require('graphql')
const { tokenType } = require('../types')
const userModel = require('../../models/user.model')

const { JWT_SECRET, JWT_LIFESPAN } = process.env
const generateToken = user => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: parseInt(JWT_LIFESPAN) // expiration in seconds
  })
}

const authQuery = {
  name: 'authQuery',
  type: tokenType,
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_, args) {
    const { email, password } = args
    const user = await userModel.authenticate(email, password)
    if (user instanceof Error) {
      return null
    } else {
      const token = generateToken(user)
      return {
        token
      }
    }
  }
}

module.exports = authQuery
