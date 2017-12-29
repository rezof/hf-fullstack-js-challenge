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

module.exports = mongoose.model('shops', ShopSchema)
