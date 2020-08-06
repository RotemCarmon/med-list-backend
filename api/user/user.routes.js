const express = require('express')
const { requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getUser, getUsers, addUser, deleteUser, updateUser, changePassword, verifyEmail} = require('./user.controller')
const router = express.Router()


router.get('/', requireAdmin, getUsers)
router.get('/:id', requireAdmin, getUser)
router.post('/', addUser)
router.post('/verify-email', verifyEmail)
router.put('/change-password', requireAdmin, changePassword)
router.put('/:id', requireAdmin, updateUser)
router.delete('/:id', requireAdmin, deleteUser)

module.exports = router