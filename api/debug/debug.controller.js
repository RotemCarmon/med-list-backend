const logger = require("../../services/logger.service");
const fs = require('fs')

async function env(req, res) {
  res.send(process.env);
}

async function getLogs(req, res) {
  let logs = fs.readFileSync('logs/backend.log', 'utf-8');
  res.send(logs)
}

async function connect(req, res) {
  res.send(`CONNECTED SUCCESSFULY!!!\n Runninig in ${process.env.NODE_ENV} mode`)
}

module.exports = {
  env,
  getLogs,
  connect
};
