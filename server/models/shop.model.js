const mongoose = require('mongoose')
const chalk = require('chalk')

const ShopSchema = mongoose.Schema({
  email: String,
  name: String,
  picture: String,
  city: String,
  hello: String,
  location: {
    type: {
      type: String
    },
    coordinates: [Number, Number]
  }
})

ShopSchema.statics = {
  all(exclude = []) {
    return this.find({ _id: { $nin: exclude } })
      .exec()
      .catch(err => {
        console.log(chalk.red('failed to fetch shops', err))
        return err
      })
  }
}

module.exports = mongoose.model('shops', ShopSchema)
