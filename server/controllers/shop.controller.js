const chalk = require('chalk')
const ShopModel = require('../models/shop.model')
const LikeModel = require('../models/like.model')
const { distanceBetweenTwoPoints } = require('../utils')

/**
 * Route: /shops
 * return shops list ordered by distance asc
 * @param latitude
 * @param longitude
 *
 * @return {*}
 * **/
const fetchAll = (req, res) => {
  const { latitude: lat1, longitude: lon2 } = req.query

  const p1 = {
    latitude: parseFloat(lat1),
    longitude: parseFloat(lon2)
  }

  const getDistance = distanceBetweenTwoPoints(p1)
  ShopModel.all()
    .then(shops => {
      const sortedShos = shops
        .map(shop => {
          const {
            _id: id,
            email,
            name,
            picture,
            city,
            location: { coordinates: [lon2, lat2] }
          } = shop
          const p2 = {
            latitude: lat2,
            longitude: lon2
          }
          const distance = getDistance(p2)
          return {
            id,
            name,
            email,
            city,
            picture,
            distance
          }
        })
        .sort((a, b) => a.distance - b.distance)
      res.json({ shops: sortedShos })
    })
    .catch(err => {
      console.log(chalk.red('/shop: ', err))
      res.json({ shops: [] })
    })
}

/**
 * route: /shop/like/:id
 * add shop to preferred list
 * @param id : shop id
 *
 * @return {*}
 * **/
const likeShop = (req, res) => {
  const { id: user_id } = req.user
  const shop_id = req.params.id

  LikeModel.create(
    {
      user_id,
      shop_id
    },
    (err, like) => {
      if (err) {
        console.log(chalk.red('failed to create like', err))
        res.statusCode = 500
        res.json({ error: ['failed to save like'] })
      } else {
        res.json({ success: true })
      }
    }
  )
}

module.exports = {
  fetchAll,
  likeShop
}
