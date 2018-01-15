const { GraphQLObjectType, GraphQLString } = require('graphql')

const tokenType = new GraphQLObjectType({
  name: 'tokenType',
  fields: {
    token: {
      type: GraphQLString
    }
  }
})

module.exports = tokenType
