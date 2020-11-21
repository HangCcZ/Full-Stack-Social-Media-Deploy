const user = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJson())
}

module.exports = {
  usersInDb,
}
