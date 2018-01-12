const path = require('path')
const { GraphQLString, GraphQLNonNull } = require('graphql')
const { shopType } = require(path.resolve(__dirname, '../types'))
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
