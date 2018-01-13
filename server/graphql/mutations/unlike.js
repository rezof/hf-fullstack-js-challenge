const { GraphQLNonNull, GraphQLString } = require('graphql')
const { actionType } = require('../types')
const likeModel = require('../../models/like.model')

const unlikeMutation = {
  name: 'unlikeMutation',
  type: actionType,
  args: {
    shopId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_, args, context) {
    const { shopId: shop_id } = args
    const { user: { id: user_id } } = context
    const removedLike = await likeModel.findOneAndRemove({
      user_id,
      shop: shop_id
    })
    return removedLike
  }
}

module.exports = unlikeMutation
