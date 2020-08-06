const bcrypt = require('bcrypt')
const dbService = require("../../services/db.service");

async function query(filterBy = {}) {
  var query = _buildCriteria(filterBy);

  const users = await dbService.runSQL(query);
  return users;
}

async function getById(userId) {
  var query = `SELECT * FROM user WHERE user._id = ${userId}`;

  var users = await dbService.runSQL(query);
  if (users.length === 1) {
    const user = users[0];
    delete user.password;
    return user;
  }
  throw new Error(`user id ${userId} not found`);
}

async function getByEmail(email) {
  var query = `SELECT * FROM user WHERE user.email = '${email}'`;
  var users = await dbService.runSQL(query);
  if (users.length === 1) {
    const user = users[0];
    return user;
  }
  throw new Error(`user email ${email} not found`);
}

async function add(user) {
  var query = `INSERT INTO user (fullName, company, email, phone, streetAddress, city, password, permission, createdAt)
                VALUES ("${user.fullName}",
                        "${user.company}",
                        "${user.email}",
                        "${user.phone}",
                        "${user.streetAddress}",
                        "${user.city}",
                        "${user.password}",
                        "${user.permission}",
                        "${user.createdAt}")`;

  const res = await dbService.runSQL(query);
  const addedUser = user;
  addedUser._id = res.insertId;
  delete addedUser.password
  return addedUser;
}

async function update(user) {
  try {
    var query = `UPDATE user set 
                    fullName = "${user.fullName}",
                    company = "${user.company}",
                    email = "${user.email}",
                    phone = "${user.phone}",
                    streetAddress = "${user.streetAddress}",
                    city = "${user.city}",
                    permission = "${user.permission}"
                    WHERE user._id = ${user._id};`;

    var okPacket = await dbService.runSQL(query);
    if (okPacket.affectedRows !== 0) return okPacket;
  } catch (err) {
    throw new Error(`No user updated - user id ${user._id}`, err);
  }
}

async function remove(userId) {
  try {
    var query = `DELETE FROM user WHERE user._id = ${userId}`;
    var okPacket = await dbService.runSQL(query);
    if (okPacket.affectedRows === 1) return okPacket;
  } catch (err) {
    throw new Error(`No user delete - user id ${user._id}`);
  }
}

// This function is unnecessery - should use getUserByEmail
async function verifyEmail(email) {
  var query = `SELECT * FROM user WHERE user.email = '${email}'`;
  var users = await dbService.runSQL(query);
  console.log("Verifing user", users);
  if (users.length === 1) {
    const user = users[0];
    return user;
  }
  return;
}

async function changePassword(_id, password) {
  try {
    const hash = await bcrypt.hash(password, +process.env.SALT_ROUNDS)
      
    const query = `UPDATE user SET user.password = "${hash}" WHERE user._id = ${_id};`;
    var okPacket = await dbService.runSQL(query);
    if (okPacket.affectedRows !== 0) return okPacket;
  } catch (err) {
    throw new Error(`Password did not changed for user id ${user._id}`, err);
  }
}

module.exports = {
  query,
  getById,
  add,
  update,
  remove,
  getByEmail,
  verifyEmail,
  changePassword
};

function _buildCriteria(filterBy) {
  var query = "";

  if (filterBy.email) {
    query = `user.email LIKE '%${filterBy.email}%'`;
  }

  if (!query) query = 1;
  var criteria = `SELECT * FROM user  WHERE ${query}`;

  return criteria;
}