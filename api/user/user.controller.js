const userService = require("./user.service");
// const { user } = require("../../config/prod");

async function getUser(req, res) {
  const user = await userService.getById(req.params.id);
  res.send(user);
}

async function getUsers(req, res) {
  const users = await userService.query(req.query);
  res.send(users);
}

async function deleteUser(req, res) {
  await userService.remove(req.params.id);
  res.end();
}
async function addUser(req, res){
  try{
    const {user} = req.body
    const addedUser = await userService.add(user);
    res.send(addedUser)
  } catch(err) {
    res.status(400).send(err);
  }

}

async function updateUser(req, res) {
  const user = req.body;
  await userService.update(user);
  res.send(user);
}

async function verifyEmail(req, res) {
  try{
    const {email} = req.body;
    const user = await userService.verifyEmail(email);
    res.status(200).send(user);
  } catch(err) {
    res.status(400).send(err);
  }
}

async function changePassword(req, res) {
  try {
    const { _id, password } = req.body;
    await userService.changePassword(_id, password);
    res.status(200).send("Success");
  } catch (err) {
    res.status(400).send("Bad Query");
  }
}

module.exports = {
  getUser,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  changePassword,
  verifyEmail
};
