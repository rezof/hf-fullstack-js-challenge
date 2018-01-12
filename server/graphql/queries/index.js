const path = require('path')
const { GraphQLObjectType, GraphQLList } = require('graphql')
const shopsQuery = require(path.resolve(__dirname, './shops'))
const shopQuery = require(path.resolve(__dirname, './shop'))

const queries = new GraphQLObjectType({
  name: 'rootQueries',
  description: 'root queries',
  fields: {
    shops: shopsQuery,
    shop: shopQuery
  }
})

module.exports = queries
