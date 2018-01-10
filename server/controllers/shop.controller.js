const chalk = require('chalk')
const jwt = require('jsonwebtoken')

const ShopModel = require('../models/shop.model')
const LikeModel = require('../models/like.model')
const DislikeModel = require('../models/dislike.model')
const UserModel = require('../models/user.model')

const { distanceBetweenTwoPoints } = require('../utils')

/**
 * verify user
 * @param token
 *
 * @return {*}
 */
const verifyAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['authorization'] ||
    req.headers['x-access-token']
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        console.log(chalk.red('token not valid', err))
        res.statusCode = 401
        res.json({ errors: ['token not valid'] })
      } else {
        const { id = '', email = '' } = decoded
        UserModel.verify(id, email)
          .then(user => {
            if (user) {
              req.user = user
              next()
            } else {
              res.statusCode = 401
              res.json({ errors: ['user not found'] })
            }
          })
          .catch(err => {
            console.log(chalk.red('failed to verify user', err))
            res.statusCode = 500
            res.end()
          })
      }
    })
  } else {
    res.statusCode = 401
    res.json({ errors: ['authentification required!'] })
  }
}

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
      const {
        _id: id,
        name,
        picture,
        location: { coordinates: [longitude, latitude] }
      } = shop
      // shop coordinates
      const p2 = {
        latitude,
        longitude
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
const getUserDislikedShopsId = user_id => {
  return DislikeModel.findByUser(user_id)
    .then(dislikes => dislikes.map(dislike => dislike.shop_id))
    .catch(err => {
      console.log(chalk.red('failed to load user liked shops', err))
      throw err
    })
}

/**
 * get shops liked by user ordered by distance
 * @param user_id
 * return promise
 */
const getUserLikedShops = (user_id, getDistanceFromUser) => {
  return LikeModel.findByUser(user_id)
    .then(shops => {
      throw new Error('hi')
      // sortShopsByDistance(shops, getDistanceFromUser)
    })
    .catch(err => {
      console.log(chalk.red('failed to load user liked shops', err))
      throw err
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
const fetchAll = async (req, res) => {
  const { latitude: lat1, longitude: lon2 } = req.query
  const { user: { id: user_id } } = req

  // user coordinates
  const p1 = {
    latitude: parseFloat(lat1),
    longitude: parseFloat(lon2)
  }

  // curry distanceBetweenTwoPoints with p1 in context
  const getDistanceFromUser = distanceBetweenTwoPoints(p1)
  try {
    // get user's liked shops
    const likedShops = await getUserLikedShops(user_id, getDistanceFromUser)
    // get user's disliked shops
    const dislikedShops = await getUserDislikedShopsId(user_id)

    // merge liked and disliked ids
    const excludedIds = likedShops.map(shop => shop.id).concat(dislikedShops)
    // list of shops with liked and disliked shops excluded
    const shops = await ShopModel.all(excludedIds)
    // calculate shops distance
    // limited to 30 shops max
    const nearShops = sortShopsByDistance(shops, getDistanceFromUser).slice(
      0,
      30
    )
    res.json({ shops: { near: nearShops, preferred: likedShops } })
  } catch (err) {
    console.log(chalk.red('failed to fetch liked/disliked shop', err))
    res.statusCode = 500
    res.end()
  }
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
      shop: shop_id
    },
    (err, removed) => {
      if (err) {
        console.log(chalk.red('failed to remove like', err))
        res.statusCode = 500
        res.json({ error: ['failed to remove like'] })
      } else if (removed) {
        res.json({ success: true })
      } else {
        console.log(chalk.red('failed to remove like', removed))
        res.statusCode = 400
        res.json({ success: false })
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
  verifyAuth,
  fetchAll,
  likeShop,
  dislikeShop,
  unlikeShop
}
