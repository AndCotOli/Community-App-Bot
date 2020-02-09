const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  roleId: {
    type: String,
    required: true
  },
  githubNumber: Number,
  canBeAssigned: {
    type: Boolean,
    required: true
  }
});

const Role = model('Role', roleSchema);

module.exports = Role;
// module.exports.schema = roleSchema;
