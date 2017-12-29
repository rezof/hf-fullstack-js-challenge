const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.sendfile(path.resolve(__dirname, '../../public/index.html'))
})

module.exports = router
