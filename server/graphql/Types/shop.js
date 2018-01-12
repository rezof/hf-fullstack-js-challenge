const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLFloat
} = require('graphql')

const shopType = new GraphQLObjectType({
  name: 'shopType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    city: {
      type: GraphQLString
    },
    picture: {
      type: GraphQLString
    },
    distance: {
      type: GraphQLFloat
    }
  }
})

module.exports = shopType
