const mongoose = require('mongoose')

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
  all() {
    return this.find()
      .exec()
      .then(shops => {
        return shops
      })
  }
}

module.exports = mongoose.model('shops', ShopSchema)
