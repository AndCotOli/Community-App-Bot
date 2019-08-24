module.exports = {
  name: "get-timezones",
  description: "Get available Timezones to convert time",
  execute(message, _args) {
    // const moment = require("../lib/moment-timezone");
    // const data = [];
    // data.push("Available Timezones:");
    // data.push(moment.tz.names().join("\n"));

    // message.channel.send(data.join("\n"), { split: true });

    message.channel.send(
      "To get your specific timezone, visit the map at https://momentjs.com/timezone/"
    );
  }
};
