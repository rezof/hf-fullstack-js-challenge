const { GraphQLString, GraphQLNonNull } = require('graphql')
const shopType = require('../Types/shop')
const shopModel = require('../../models/shop.model')

const shopQuery = {
  type: shopType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_, args) {
    const shop = await shopModel.findById(args.id)
    return shop
  }
}

module.exports = shopQuery
