const User = require('../../DB/Models/User');
const Role = require('../../DB/Models/Role');

module.exports = {
  name: 'set-role',
  description: 'Set or delete your roles with this command',
  usage: '<roleName1> <roleName2> <roleName3> ...',
  args: true,
  async: true,
  async execute(message, args) {
    const user = User.findOne({ discordId: message.author.id });
    for (let role of args) {
      const dbRole = await Role.findOne({ name: role });
      if (!dbRole || !dbRole.canBeAssigned) {
        message.channel.send(
          `Role ${role} doesn't exist or is marked as non-assignable`
        );
        continue;
      }

      message.member.addRole(dbRole.roleId);
      user.roles.push(dbRole._id);
    }

    user.save(err => {
      console.log(`Error while saving ${user.name} to the DB`, err);
      return message.channel.send(
        'An error occurred while saving you to the DB, please contact a gardener.'
      );
    });
    message.channel.send('Added you to the roles you selected');
  }
};
