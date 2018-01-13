const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const like = require('./like')
const dislike = require('./dislike')
const unlike = require('./unlike')

const mutations = new GraphQLObjectType({
  name: 'rootMutations',
  description: 'root mutations',
  fields: {
    like,
    dislike,
    unlike
  }
})

module.exports = mutations
