const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const like = require('./like')

const mutations = new GraphQLObjectType({
  name: 'rootMutations',
  description: 'root mutations',
  fields: {
    like
  }
})

module.exports = mutations
