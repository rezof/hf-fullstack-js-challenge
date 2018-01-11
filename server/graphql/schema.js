const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const queries = require('./queries')

const schema = new GraphQLSchema({
  name: 'rootSchema',
  query: queries
})

module.exports = schema
