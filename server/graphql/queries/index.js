const { GraphQLObjectType, GraphQLList } = require('graphql')
const shopsQuery = require('./shops')
const shopQuery = require('./shop')

const queries = new GraphQLObjectType({
  name: 'rootQueries',
  description: 'root queries',
  fields: {
    shops: shopsQuery,
    shop: shopQuery
  }
})

module.exports = queries
