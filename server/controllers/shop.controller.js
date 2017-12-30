const chalk = require('chalk')
const ShopModel = require('../models/shop.model')
const LikeModel = require('../models/like.model')
const DislikeModel = require('../models/dislike.model')

const { distanceBetweenTwoPoints } = require('../utils')

/**
 * calculates distance and returns an ordered shops list
 * @param shops
 * @param getDistanceFromUser
 *
 * @return {*}
 */
const sortShopsByDistance = (shops, getDistanceFromUser) => {
  return shops
    .map(shop => {
      const { _id: id, name, picture, location } = shop
      // shop coordinates
      const p2 = {
        latitude: location.coordinates.lat2,
        longitude: location.coordinates.lon2
      }
      // distance between shop and user
      const distance = getDistanceFromUser(p2)
      return { id, name, picture, distance }
    })
    .sort((a, b) => a.distance - b.distance)
}

/**
 * get shops disliked by user
 * @param user_id
 * return promise
 */
const getUserDislikedShops = user_id => {
  return DislikeModel.findByUser(user_id)
    .then(dislikes => dislikes.map(dislike => dislike.shop_id))
    .catch(err => {
      console.log(chalk.red('failed to load user liked shops', err))
      return err
    })
}

/**
 * get shops liked by user ordered by distance
 * @param user_id
 * return promise
 */
const getUserLikedShops = (user_id, getDistanceFromUser) => {
  return LikeModel.findByUser(user_id)
    .then(shops => sortShopsByDistance(shops, getDistanceFromUser))
    .catch(err => {
      console.log(chalk.red('failed to load user liked shops', err))
      return err
    })
}

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
  const { user: { id: user_id } } = req

  // user coordinates
  const p1 = {
    latitude: parseFloat(lat1),
    longitude: parseFloat(lon2)
  }

  // curry getDistance with p1 in context
  const getDistanceFromUser = distanceBetweenTwoPoints(p1)

  Promise.all([
    getUserLikedShops(user_id, getDistanceFromUser),
    getUserDislikedShops(user_id)
  ])
    .then(dt => {
      const [likedShops = [], dislikedShops = []] = dt
      const exclude = likedShops.map(shop => shop.id).concat(dislikedShops)
      ShopModel.all(exclude)
        .then(shops => {
          const nearShops = sortShopsByDistance(
            shops,
            getDistanceFromUser
          ).slice(0, 30) // return 30 shops max

          res.json({ shops: { near: nearShops, preferred: likedShops } })
        })
        .catch(err => {
          console.log(chalk.red('failed to fetch shops', err))
          rez.statusCode = 500
          res.json({})
        })
    })
    .catch(err => {
      console.log(chalk.red('failed to fetch liked/disliked shop', err))
      rez.statusCode = 500
      res.json({})
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
      shop: shop_id
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

/**
 * route: /shop/unlike/:id
 * remove shop from preferred list
 * @param id : shop id
 *
 * @return {*}
 * **/
const unlikeShop = (req, res) => {
  const { id: user_id } = req.user
  const shop_id = req.params.id

  LikeModel.findOneAndRemove(
    {
      user_id,
      shop_id
    },
    (err, removed) => {
      if (err) {
        console.log(chalk.red('failed to remove like', err))
        res.statusCode = 500
        res.json({ error: ['failed to remove like'] })
      } else if (removed) {
        res.json({ success: true })
      } else {
        res.statusCode = 400
        res.success({ success: false })
      }
    }
  )
}

/**
 * route: /shop/dislike/:id
 * dislike shop
 * @param id : shop id
 *
 * @return {*}
 * **/
const dislikeShop = (req, res) => {
  const { id: user_id } = req.user
  const shop_id = req.params.id

  DislikeModel.create(
    {
      user_id,
      shop_id
    },
    (err, like) => {
      if (err) {
        console.log(chalk.red('failed to save dislike', err))
        res.statusCode = 500
        res.json({ error: ['failed to save dislike'] })
      } else {
        res.json({ success: true })
      }
    }
  )
}

module.exports = {
  fetchAll,
  likeShop,
  dislikeShop,
  unlikeShop
}
