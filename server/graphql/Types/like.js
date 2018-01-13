const path = require('path')
const { GraphQLObjectType, GraphQLNonNull, GraphQLID } = require('graphql')
const shopType = require(path.resolve(__dirname, './shop'))
const ShopModel = require('../../models/shop.model')

const likeType = new GraphQLObjectType({
  name: 'likeType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    user_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    shop: {
      type: shopType,
      async resolve(like) {
        // replace the shop id on the shop field
        // with a shop type object
        const likedShop = await ShopModel.findById(like.shop).exec()
        return likedShop
      }
    }
  }
})

module.exports = likeType
