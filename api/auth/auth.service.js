const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const dbService = require('../../services/db.service')
const mailService = require('../mail/mail.service')


// LOGIN
async function login(email, password) {
    logger.debug(`auth.service - login with email: ${email}`)
    if (!email || !password) throw new Error('email and password are required!')

    // check if email exist
    const user = await userService.getByEmail(email)
    if (!user) throw new Error('Invalid email or password')
    // check if password exist
    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error('Invalid email or password')
    // delete password before returning the user to the FE
    delete user.password;
    return user;
}

// SIGNUP
async function signup(fullName, company, email, phone, streetAddress, city, password, permission, createdAt) {
    logger.debug(`auth.service - signup with fullName: ${fullName}, email: ${email}, as: ${permission}`)
    if (!email || !password) throw new Error('email and password are required!')

    // check if email already exist in DB
    const res = await userService.verifyEmail(email);
    if (res) {
        throw new Error(`${email} User with the same Email already exist!`);
    }

    const hash = await bcrypt.hash(password, +process.env.SALT_ROUNDS)
    // add user to the user DB
    const user = await userService.add({ fullName, company, email, phone, streetAddress, city, password: hash, permission, createdAt });
    // send confirmation email to the user
    await mailService.sendConfirmationMail(email, password);
    return user;
}



// ### --JWT-- ### //

//SAVE REFRESH TOKEN TO THE DB
async function saveRefreshToken(token) {
    var query = `INSERT INTO token (token) 
                    VALUES ("${token}")`;

    return await dbService.runSQL(query)
}

async function getRefreshToken(refreshToken) {
    var query = `SELECT * FROM token WHERE token = '${refreshToken}'`;
    var tokens = await dbService.runSQL(query);
    if (tokens.length === 1) {
        const token = tokens[0];
        return token
    }
    throw new Error(`Refresh token does not exist`);
}

// DELETE REFRESH TOKEN FROM DB
async function removeRefreshToken(refreshToken) {
    try {
        // get the token id from the database
        const { _id } = await getRefreshToken(refreshToken)

        var query = `DELETE FROM token WHERE _id = ${_id}`;
        var okPacket = await dbService.runSQL(query);
        if (okPacket.affectedRows === 1) return okPacket;
    } catch (err) {
        throw new Error('No refresh token');
    }
}

module.exports = {
    login,
    signup,
    saveRefreshToken,
    getRefreshToken,
    removeRefreshToken
}