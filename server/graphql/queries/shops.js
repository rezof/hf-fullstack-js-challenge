const { GraphQLObjectType, GraphQLList } = require('graphql')
const shopType = require('../Types/shop')

const shopsQuery = {
  type: new GraphQLList(shopType),
  resolve() {
    return [
      {
        id: '5a0c6b42fd3eb67969316d81',
        name: 'Mondicil',
        picture: 'http://placehold.it/150x150'
      },
      {
        id: '5a0c6b2dfd3eb67969316d6d',
        name: 'Mondicil',
        picture: 'http://placehold.it/150x150'
      },
      {
        id: '5a0c6bd5fd3eb67969316e02',
        name: 'Flexigen',
        picture: 'http://placehold.it/150x150'
      },
      {
        id: '5a0c680afd3eb67969316d0b',
        name: 'Animalia',
        picture: 'http://placehold.it/150x150'
      },
      {
        id: '5a0c689efd3eb67969316d4e',
        name: 'Geekular',
        picture: 'http://placehold.it/150x150'
      },
      {
        id: '5a0c680afd3eb67969316d14',
        name: 'Futuris',
        picture: 'http://placehold.it/150x150'
      },
      {
        id: '5a0c6b55fd3eb67969316d9d',
        name: 'Genekom',
        picture: 'http://placehold.it/150x150'
      },
      {
        id: '5a0c6b55fd3eb67969316daa',
        name: 'Reversus',
        picture: 'http://placehold.it/150x150'
      }
    ]
  }
}

module.exports = shopsQuery
