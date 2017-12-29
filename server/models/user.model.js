const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// hash user password before saving to db
UserSchema.pre('save', function(next) {
  const user = this
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err)
    }
    user.password = hash
    next()
  })
})

UserSchema.statics = {}

module.exports = mongoose.model('users', UserSchema)
