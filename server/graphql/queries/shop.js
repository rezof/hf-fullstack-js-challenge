const path = require('path')
const { GraphQLID, GraphQLNonNull } = require('graphql')
const { shopType } = require(path.resolve(__dirname, '../types'))
const shopModel = require('../../models/shop.model')

const shopQuery = {
  type: shopType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve(_, args) {
    const shop = await shopModel.findById(args.id)
    return shop
  }
}

module.exports = shopQuery
