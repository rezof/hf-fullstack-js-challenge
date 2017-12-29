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

UserSchema.statics = {
  authenticate(email, password) {
    return new Promise((resolve, reject) => {
      this.findOne({ email })
        .exec()
        .then(user => {
          bcrypt.compare(password, user.password, (err, result) => {
            if (result === true) {
              const usr = {}
              usr['id'] = user['_id']
              usr['email'] = user['email']
              resolve(usr)
            }
            const error = new Error('user not found')
            error.status = 401
            reject(error)
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = mongoose.model('users', UserSchema)
