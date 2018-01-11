const { GraphQLObjectType, GraphQLList } = require('graphql')
const shopType = require('../Types/shop')
const shopModel = require('../../models/shop.model')

const shopsQuery = {
  type: new GraphQLList(shopType),
  async resolve() {
    const shops = await shopModel.all([])
    return shops.splice(0, 30) // 30 shops max
  }
}

module.exports = shopsQuery
