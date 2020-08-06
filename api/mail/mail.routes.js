const express = require('express')
const { requireAdmin }  = require('../../middlewares/requireAuth.middleware')
const { sendConfirmationMail, newUserApplication, contactForm, forgotPassword, sendNewPasswordToUser, sendTestMail } = require('./mail.controller')

const router = express.Router()

router.post('/confirm', requireAdmin, sendConfirmationMail)
router.post('/new-password', sendNewPasswordToUser)
router.post('/apply', newUserApplication)
router.post('/contact', contactForm)
router.post('/forgot', forgotPassword)
router.post('/test', sendTestMail)

module.exports = router