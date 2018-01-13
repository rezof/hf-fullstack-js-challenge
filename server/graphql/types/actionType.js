const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql')

const actionType = new GraphQLObjectType({
  name: 'actionType',
  fields: {
    id: {
      type: GraphQLString
    },
    user_id: {
      type: GraphQLString
    },
    shop_id: {
      type: GraphQLString
    }
  }
})

module.exports = actionType
