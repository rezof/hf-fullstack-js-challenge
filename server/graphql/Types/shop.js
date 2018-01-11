const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLFloat
} = require('graphql')

const shopType = new GraphQLObjectType({
  name: 'shop',
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
      type: GraphQLFloat,
      resolve(shop, args, context) {
        // user should be in context
        // TODO calculate distance between shop and user
        return 0
      }
    }
  }
})

module.exports = shopType
