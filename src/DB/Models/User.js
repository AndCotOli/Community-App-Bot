const { Schema, model } = require('mongoose');
const Role = require('./Role').schema;

const userSchema = new Schema({
  name: String,
  github: String,
  email: String,
  discordId: {
    type: String,
    required: true
  },
  roles: [Role],
  joinedAt: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  isInvitedGithub: {
    type: Boolean,
    default: false
  },
  isInvitedTrello: {
    type: Boolean,
    default: false
  }
});

const User = model('User', userSchema);

module.exports = User;
module.exports.schema = userSchema;
