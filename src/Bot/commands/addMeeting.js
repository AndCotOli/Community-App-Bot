module.exports = {
  name: "add-meeting",
  description:
    "Add the next date for the meeting, use the DD-MM-YYYYThh:mm:ss. Example: '23-10-2019T17:30:00'. Time must be UTC! ",
  args: true,
  usage: "<time>",
  admin: true,
  async: true,
  async execute(message, args) {
    const moment = require("moment-timezone");
    const db = require("../Db");

    const date = moment.utc(args[0], moment.ISO_8601);
    db.meeting = date;

    return message.channel.send(
      `Successfully added a meeting on ${date.format(
        "dddd, MMMM Do YYYY - hh:mm:ss a z"
      )}`
    );
  }
};
