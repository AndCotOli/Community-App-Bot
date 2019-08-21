module.exports = {
  name: "meeting",
  description: "Information about next meeting",
  usage: "<?timezone>",
  async: true,
  async execute(message, args) {
    const moment = require("moment-timezone");
    const db = require("../Db");

    const date = db.meeting;
    if (!args.length) args[0] = "UTC";
    return message.channel.send(
      `Next Meeting is on  ${moment(date)
        .tz(date, args[0])
        .format("dddd, MMMM Do YYYY - hh:mm:ss a z")}`
    );
  }
};
