const logger = require('../services/logger.service')
const jwt = require('jsonwebtoken')


// CHECK IF TOKEN EXIST
async function requireToken(req, res, next) {
  // get the Auth header value
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader && authHeader.split(' ')[1];
    // verify the access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenUser) => {
      if(err) {
        // verify return an error
        res.status(401).send({ error: '401 Token is unauthorized' })
      } else {
        next()
      }
    })
  } else {
    res.status(401).send({ error: '401 token does not exist' })
  }
}


// CHECK FOR ADMIN PREMISSION
async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader && authHeader.split(' ')[1];
    // verify the access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenUser) => {
      if (err) {
        // verify return an error
        res.status(401).send({ error: '401 Token is unauthorized' })
      } else {
        const user = tokenUser.user
        if (user.permission === 'Admin') {
          next()
        } else {
          res.status(403).send({ error: '403 Forbidden' })

        }
      }
    })
  } else {
    // if no auth header exist
    res.status(401).send({ error: '401 token does not exist' })
  }
}




module.exports = {
  requireAdmin,
  requireToken
}
