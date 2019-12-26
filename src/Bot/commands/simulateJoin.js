const onGuildJoin = require('../tasks/onGuildJoin');

module.exports = {
  name: 'simulatejoin',
  description: 'Trick the bot so it thinks it just entered a new server',
  admin: true,
  execute(message, _args) {
    onGuildJoin(message.guild);
  }
};
