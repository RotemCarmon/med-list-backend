const express = require('express')
const {env, getLogs, connect} = require('./debug.controller')

const router = express.Router() 

router.get('/env', env)
router.get('/log', getLogs)
router.get('/connected', connect)

module.exports = router