const express = require('express')
const {requireAdmin, }  = require('../../middlewares/requireAuth.middleware')
const {login, signup,  logout, decodeUser, generateNewToken } = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', requireAdmin, signup)
router.delete('/logout', logout)
router.post('/decode', decodeUser)
router.post('/refresh_token', generateNewToken)

module.exports = router