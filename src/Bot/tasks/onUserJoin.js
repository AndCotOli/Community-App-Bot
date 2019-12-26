const User = require('../../DB/Models/User');

async function onUserJoin(user) {
  // Check if User is in the DB
  const existingUser = await User.findOne({ discordId: user.id });
  console.log(existingUser);
  // Add user to the DB
  // Discord ID
}

module.exports = onUserJoin;