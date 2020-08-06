const authService = require("./auth.service");
const logger = require("../../services/logger.service");
const jwt = require("jsonwebtoken");

// SIGNIN
async function login(req, res) {
  const { email, password, remember } = req.body;
  let exp = remember ? "365d" : "24h";
  try {
    const user = await authService.login(email, password);
    // getting access JWT
    const accessToken = await _generateAccessToken(user);

    // getting refresh token
    jwt.sign(
      { user },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: exp },
      (err, refreshToken) => {
        // TODO: handle error
        // save refresh token to DB
        authService.saveRefreshToken(refreshToken);
        let payload = {
          accessToken,
          refreshToken,
        };
        res.json(payload);
      }
    );
  } catch (err) {
    res.status(401).send({ error: `${err}` });
  }
}

// SIGNUP
async function signup(req, res) {
  try {
    const { fullName, company, email, phone, streetAddress, city, password, permission, createdAt, } = req.body;
    logger.debug( fullName + ", " + email + ", "  + password + ", " + permission );
    const user = { fullName, company, email, phone, streetAddress, city, password, permission, createdAt, };
    // Signup in auth service
    const account = await authService.signup(
      fullName, company, email, phone, streetAddress, city, password, permission, createdAt 
    );
    logger.debug(
      `auth.route - new account created: ` + JSON.stringify(account)
    );
    res.json(user);
  } catch (err) {
    logger.error("[SIGNUP] " + err);
    res.status(500).send({ error: `${err}` });
  }
}

// LOGOUT
async function logout(req, res) {
  try {
    const refreshToken = req.body.refreshToken;
    const removedToken = await authService.removeRefreshToken(refreshToken);
    logger.debug("User logged out");
    res.status(204).send(removedToken);
  } catch (err) {
    res.status(401).send(err);
  }
}

// GENERATE NEW ACCESS TOKEN
async function generateNewToken(req, res) {
  try {
    const refreshToken = req.body.refreshToken;
    if (refreshToken === null) return res.status(401).send("No refresh Token");
    // get refresh token from the token DB
    const { token } = await authService.getRefreshToken(refreshToken);
    // ** consider at this point generating a new refresh token  ** //
    if (!token)
      return res.status(403).send("Refresh token does not exist in database");
      
      // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) {
          return res.status(403).send(err.message);
        }
        const user = payload.user;
        // generate new access token
        const accessToken = await _generateAccessToken(user);
        const decodedUser = jwt.decode(accessToken);
        res.send({ accessToken, decodedUser });
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function decodeUser(req, res) {
  try {
    const { accessToken } = req.body;
    const decodedUser = jwt.decode(accessToken);
    res.send(decodedUser);
  } catch (err) {
    res.status(401);
  }
}

module.exports = {
  login,
  signup,
  logout,
  generateNewToken,
  decodeUser,
};
// GENERATE ACCESS TOKEN
async function _generateAccessToken(user) {
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return accessToken;
}
