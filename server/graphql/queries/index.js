const { GraphQLObjectType, GraphQLList } = require('graphql')
const shops = require('./shops')

const queries = new GraphQLObjectType({
  name: 'rootQueries',
  description: 'root queries',
  fields: {
    shops
  }
})

module.exports = queries
