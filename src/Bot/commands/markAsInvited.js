const User = require('../../DB/Models/User');

module.exports = {
  name: 'mark',
  description: 'marks a user/s as GitHub invited',
  args: true,
  admin: true,
  usage: '@userToMark [...@userToMark2]',
  secret: true,
  async: true,
  async execute(message, args) {
    if (!message.mentions.users.size)
      return message.channel.send('You have to @ the username');

    message.mentions.users.map(async u => {
      let user = await User.findOne({ discordId: user.id });

      user.isInvitedGithub = true;
      await user.save();
    });

    message.channel.send('User/s marked as github invited');
  }
};
