const mongoose = require('mongoose')
const ttl = require('mongoose-ttl')

const DislikeModel = new mongoose.Schema({
  user_id: String,
  shop_id: String
})

DislikeModel.statics = {
  findByUser(user_id) {
    return this.find({ user_id })
      .select('shop_id')
      .exec()
      .catch(err => {
        console.log(chalk.red("failed to fetch user's disliked shops", err))
        return err
      })
  }
}

// set document ttl (expiration)
DislikeModel.plugin(ttl, {
  ttl: 10000 // 2 hours
})

module.exports = mongoose.model('dislikes', DislikeModel)
