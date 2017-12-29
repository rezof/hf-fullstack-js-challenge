const chalk = require('chalk')
const ShopModel = require('../models/shop.model')
const { distanceBetweenTwoPoints } = require('../utils')

/**
 * return shops list ordered by distance asc
 * @param latitude
 * @param longitude
 *
 * @return {*}
 * **/
const fetchAll = (req, res) => {
  const { latitude, longitude } = req.query

  const start = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  }

  const getDistance = distanceBetweenTwoPoints(start)
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
            location: { coordinates: [latitude, longitude] }
          } = shop
          const distance = getDistance({
            latitude,
            longitude
          })
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

module.exports = {
  fetchAll
}
