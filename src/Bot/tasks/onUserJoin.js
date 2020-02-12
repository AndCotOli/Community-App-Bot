const User = require('../../DB/Models/User');
const Role = require('../../DB/Models/Role');
const { visitor: visitorRoleId } = require('../roles.json');

async function onUserJoin(member) {
  member.addRole(visitorRoleId);
  const existingUser = await User.findOne({ discordId: member.id });
  if (!existingUser) {
    const user = await User.create({
      discordId: member.user.id,
      discordTag: member.user.tag,
      joinedAt: member.joinedAt
    });

    for (let role of member.roles.array()) {
      const dbRole = await Role.findOne({ roleId: role.id }, err => {
        if (err) throw new Error('Something went wrong');
      });
      user.roles.push(dbRole.id);
    }

    user.save(err => {
      if (err) throw new Error('Something went wrong while saving the user');
    });

    member.user.send(`
    Hello and welcome to the Coding Garden Community Discord!

    To get started, send this command, so we can add you to our teams!
    \`!activate\`
    
    If you want to know the commands for this bot, use \`!help \`

    And remember, have fun!
  `);
  } else {
    member.user.send('Welcome back!');
  }
}

module.exports = onUserJoin;
