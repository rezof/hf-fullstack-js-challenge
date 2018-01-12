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
    like.populate('shop')
    return like
  }
}

module.exports = likeMutation
