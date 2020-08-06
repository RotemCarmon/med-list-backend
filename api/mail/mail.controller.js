const mailService = require('./mail.service')
const logger = require('../../services/logger.service')

async function sendConfirmationMail(req, res) {
  const { email, password } = req.body;
  await mailService.sendConfirmationMail(email, password)
  res.json('SUCCESS!')
}
async function newUserApplication(req, res) {
  const { fullName, company, email, phone, streetAddress, city } = req.body;
  await mailService.newUserApplication(fullName, company, email, phone, streetAddress, city)
  res.json('SUCCESS!')
}
async function contactForm(req, res) {
  const { fullName, company, email, phone, comments } = req.body;
  await mailService.contactForm(fullName, company, email, phone, comments)
  res.json('SUCCESS!')
}
async function forgotPassword(req, res) {
  const { email } = req.body;
  await mailService.forgotPassword(email)
  res.json('SUCCESS!')
}
async function sendNewPasswordToUser(req, res) {
  const { email, password } = req.body;
  await mailService.sendNewPasswordToUser(email, password)
  res.json('SUCCESS!')
}

async function sendTestMail(req, res) {
  const result = await mailService.sendTestMail()
  res.json(result)
}

module.exports = { 
  sendConfirmationMail,
  newUserApplication,
  contactForm,
  forgotPassword,
  sendNewPasswordToUser,
  sendTestMail
}