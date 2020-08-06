const express = require('express')
const { requireToken}  = require('../../middlewares/requireAuth.middleware')
const {getProducts, updateProducts} = require('./product.controller')

const router = express.Router() 
router.get('/', requireToken , getProducts)
router.post('/', updateProducts)




module.exports = router