const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: String,
  github: String,
  email: String,
  timezone: String,
  countryCode: String,
  discordId: {
    type: String,
    required: true
  },
  discordTag: {
    type: String,
    required: true
  },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }
  ],
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
  spreadSheetsPos: String
});

const User = model('User', userSchema);

module.exports = User;
