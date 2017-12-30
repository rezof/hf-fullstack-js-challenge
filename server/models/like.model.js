const mongoose = require('mongoose')
const chalk = require('chalk')

const LikeModel = new mongoose.Schema({
  user_id: String,
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shops'
  }
})

LikeModel.statics = {
  findByUser(user_id) {
    return this.find({ user_id })
      .populate('shop')
      .exec()
      .then(likes => likes.map(like => like.shop))
      .catch(err => {
        console.log(chalk.red("failed to fetch user's liked shops", err))
        return err
      })
  }
}

module.exports = mongoose.model('likes', LikeModel)
