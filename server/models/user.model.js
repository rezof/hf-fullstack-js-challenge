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
  checkEmail(email) {
    return this.findOne({ email }).exec()
  },
  verify(_id, email) {
    return this.findOne({ _id, email })
      .exec()
      .then(user => {
        return user
      })
      .catch(err => {
        console.log(chalk.red('failed to verify user', err))
        return err
      })
  },
  authenticate(email, password) {
    return new Promise((resolve, reject) => {
      this.findOne({ email })
        .exec()
        .then(user => {
          if (!user) {
            const error = new Error('user not found')
            reject(error)
          } else
            bcrypt.compare(password, user.password, (err, result) => {
              if (result === true) {
                const usr = {}
                usr['id'] = user['_id']
                usr['email'] = user['email']
                resolve(usr)
              } else {
                const error = new Error('user not found')
                reject(error)
              }
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = mongoose.model('users', UserSchema)
