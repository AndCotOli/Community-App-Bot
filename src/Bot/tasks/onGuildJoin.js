const User = require('../../DB/Models/User');
const Role = require('../../DB/Models/Role');

async function onGuildJoin(guild) {
  for (let role of guild.roles.array()) {
    await Role.create({
      name: role.name,
      roleId: role.id,
      githubNumber: getGitHubNumber(role.name),
      canBeAssigned: isAssignable(role)
    });
  }
  for (let member of guild.members.array()) {
    let user = await User.create({
      discordId: member.user.id,
      discordDisc: member.user.discriminator,
      joinedAt: member.joinedAt
    });
    for (let role of member.roles.array()) {
      let uRole = await Role.findOne({ roleId: role.id }, (err, role) => {
        if (err) throw new Error('Something happened', err);
      });
      user.roles.push(uRole.id);
    }
    user.save(err => {
      if (err) throw new Error('Oops, something went wrong: ', err);
    });
  }
}

function isAssignable(role) {
  return role.permissions & 0x00000008 // Is an admin?
    ? false
    : role.permissions & 0x00000001 // Can create invitation links? Used to mark as non-assignable
    ? true
    : false;
}

function getGitHubNumber(name) {
  if (name === 'Planning') return 0;
  else if (name === 'Design') return 1;
  else if (name === 'Frontend') return 2;
  else if (name === 'Backend') return 3;
  else if (name === 'Devops') return 4;
  else if (name === 'Testing') return 5;
  else return null;
}

module.exports = onGuildJoin;
