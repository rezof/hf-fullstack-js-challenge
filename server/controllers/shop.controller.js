const ShopModel = require('../models/shop.model')

const fetchAll = (req, res) => {
  ShopModel.all().then(shops => {
    res.json({ shops })
  })
}

module.exports = {
  fetchAll
}
