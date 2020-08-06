const mysql = require('mysql');
const config  =  require('../config')
const logger = require("./logger.service");

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(config); // Recreate the connection, since

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      logger.error('error when connecting to db:', err)
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    logger.error('db error', err)
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


function runSQL(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, function (error, results, fields) {
            if (error) {
              logger.error("[DB] " + error)
              reject(error);
            }
            else {
              logger.debug(`DB query ${JSON.stringify(query)} was a success!`)
              resolve(results);
            }
        });
    })
}

module.exports = {
    runSQL
}