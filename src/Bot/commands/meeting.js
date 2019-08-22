module.exports = {
  name: "meeting",
  description: "Information about next meeting",
  usage: "<?timezone>",
  execute(message, args) {
    const moment = require("moment-timezone");
    const { get } = require("../Db");

    const date = get("meeting").toString();

    console.log(date);

    if (!args.length) args[0] = "UTC";
    return message.channel.send(
      `Next Meeting is on  ${moment(date)
        .tz(args[0])
        .format("dddd, MMMM Do YYYY - hh:mm:ss a z")}`
    );
  }
};
