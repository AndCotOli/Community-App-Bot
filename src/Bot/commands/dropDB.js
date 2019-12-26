const User = require('../../DB/Models/User');
const Role = require('../../DB/Models/Role');
const Meeting = require('../../DB/Models/Meeting');

module.exports = {
  name: 'dropdb',
  description: 'remove all the contents of the DB',
  execute(message, _args) {
    // User.remove({}, () => message.channel.send('User Model cleaned'));
    // Role.remove({}, () => message.channel.send('Role Model cleaned'));
    Meeting.remove({}, () => message.channel.send('Meeting Model cleaned'));
  }
};
