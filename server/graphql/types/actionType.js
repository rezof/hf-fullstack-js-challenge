const { GraphQLObjectType, GraphQLID, GraphQLNonNull } = require('graphql')

const actionType = new GraphQLObjectType({
  name: 'actionType',
  fields: {
    id: {
      type: GraphQLID
    },
    user_id: {
      type: GraphQLID
    },
    shop_id: {
      type: GraphQLID
    }
  }
})

module.exports = actionType
