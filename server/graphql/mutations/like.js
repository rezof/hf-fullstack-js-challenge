const path = require('path')
const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql')
const { likeType } = require(path.resolve(__dirname, '../types'))
const LikeModel = require('../../models/like.model')

const likeMutation = {
  type: likeType,
  args: {
    shopId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_, args, context) {
    const { user: { id } } = context
    const { shopId } = args
    const like = await LikeModel.create({
      user_id: id,
      shop: shopId
    })
    const likedShop = {
      id: like._id,
      shop: like.shop,
      user_id: like.user_id
    }
    return likedShop
  }
}

module.exports = likeMutation
