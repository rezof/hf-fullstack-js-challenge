const mongoose = require('mongoose')

const LikeModel = new mongoose.Schema({
  user_id: String,
  shop_id: String
})

module.exports = mongoose.model('likes', LikeModel)
