module.exports = {
  name: "meeting",
  description: "Information about next meeting",
  async: true,
  async execute(message, _args) {
    const moment = require("moment");
    const db = require("../Keyv");

    const date = await db.get("nextMeeting");
    return message.channel.send(`Next Meeting is on ${moment().format(date)}`);
  }
};
