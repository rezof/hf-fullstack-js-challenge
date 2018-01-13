const { GraphQLString, GraphQLNonNull } = require('graphql')
const dislikeModel = require('../../models/dislike.model')
const { actionType } = require('../types')

const dislikeMutation = {
  name: 'dislikeMutation',
  args: {
    shopId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  type: actionType,
  async resolve(_, args, context) {
    const { shopId: shop_id } = args
    const { user: { id: user_id } } = context
    const dislike = await dislikeModel.create({
      shop_id,
      user_id
    })
    return dislike
  }
}

module.exports = dislikeMutation
