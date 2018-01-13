const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const like = require('./like')
const dislike = require('./dislike')

const mutations = new GraphQLObjectType({
  name: 'rootMutations',
  description: 'root mutations',
  fields: {
    like,
    dislike
  }
})

module.exports = mutations
