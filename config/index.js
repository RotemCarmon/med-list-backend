var config;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  config = require('./prod')
} else {
  
  // config = require('./prod')
  config = require('./dev')
  
}

module.exports = config