module.exports = {
  name: "add-meeting",
  description:
    "Add the next date for the meeting, use the DD-MM-YYYYThh:mm:ss. Example: '23-10-2019T17:30:00'. Time must be UTC! ",
  args: true,
  usage: "<time>",
  admin: true,
  async: true,
  async execute(message, args) {
    const db = require("../Keyv.js");
    const moment = require("moment");
    const date = moment(args[0], moment.ISO_8601);
    await db.set("nextMeeting", date);
    return message.channel.send(`Succesfully added a meeting on ${date}`);
  }
};
