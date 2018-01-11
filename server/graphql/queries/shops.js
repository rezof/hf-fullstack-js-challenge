const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat
} = require('graphql')
const shopType = require('../Types/shop')
const shopModel = require('../../models/shop.model')

const { distanceBetweenTwoPoints } = require('../../utils/index')

const shopsQuery = {
  type: new GraphQLList(shopType),
  args: {
    latitude: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    longitude: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(_, args, context) {
    // user coordinates
    const userCoordinates = {
      latitude: args.latitude,
      longitude: args.longitude
    }

    // curried getDistance with user coords in context
    const getDistance = distanceBetweenTwoPoints(userCoordinates)

    // all shops
    const shops = await shopModel.all([])

    return shops
      .map(shop => {
        const {
          _id: id,
          name,
          picture,
          location: { coordinates: [longitude, latitude] }
        } = shop
        const distance = getDistance({
          longitude,
          latitude
        })
        return { id, name, picture, distance }
      })
      .sort((a, b) => a.distance - b.distance)
      .splice(0, 30) // 30 shops max
  }
}

module.exports = shopsQuery
