const { Schema, model } = require('mongoose');

const meetingSchema = new Schema({
  team: {
    type: String,
    enum: ['backend', 'frontend', 'general', 'design']
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  date: Date,
  isDone: {
    type: Boolean,
    default: false
  }
});

const Meeting = model('Meeting', meetingSchema);

module.exports = Meeting;
