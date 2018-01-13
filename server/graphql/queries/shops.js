const path = require('path')
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat
} = require('graphql')
const { shopType } = require(path.resolve(__dirname, '../types'))
const shopModel = require('../../models/shop.model')
const likeModel = require('../../models/like.model')
const dislikeModel = require('../../models/dislike.model')

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
    const { user: { id: user_id } } = context

    // user coordinates
    const userCoordinates = {
      latitude: args.latitude,
      longitude: args.longitude
    }

    // curried getDistance with user coords in context
    const getDistance = distanceBetweenTwoPoints(userCoordinates)

    // user's liked shops
    const likedShops = await likeModel.findByUser(user_id)

    // user's disliked shops
    const dislikedShops = await dislikeModel.findShopIdsByUser(user_id)

    // liked shops ids + disliked shops ids
    const excludedIds = likedShops.map(shop => shop.id).concat(dislikedShops)

    // all shops
    const shops = await shopModel.all(excludedIds)

    return shops
      .map(shop => {
        const {
          _id: id,
          name,
          city,
          email,
          picture,
          location: { coordinates: [longitude, latitude] }
        } = shop
        const distance = getDistance({
          longitude,
          latitude
        })
        return {
          id,
          name,
          picture,
          city,
          email,
          distance
        }
      })
      .sort((a, b) => a.distance - b.distance)
      .splice(0, 30) // 30 shops max
  }
}

module.exports = shopsQuery
