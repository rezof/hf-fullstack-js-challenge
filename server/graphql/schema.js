const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const queries = require('./queries')
const mutations = require('./mutations')

const schema = new GraphQLSchema({
  name: 'rootSchema',
  query: queries,
  mutation: mutations
})

module.exports = schema
