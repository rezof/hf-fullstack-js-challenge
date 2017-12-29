const mongoose = require('mongoose')
const ttl = require('mongoose-ttl')

const disLikeModel = new mongoose.Schema({
  user_id: String,
  shop_id: String
})

// set document ttl (expiration)
disLikeModel.plugin(ttl, {
  ttl: 10000 // 2 hours
})

module.exports = mongoose.model('dislikes', disLikeModel)
