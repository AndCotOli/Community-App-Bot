module.exports = {
  name: "activate",
  description: "Get invited to all teams and fill your info in the Spreadsheet",
  args: true,
  async: true,
  usage: "<your@email>",
  async execute(message, args) {
    const { addBoardMember } = require("../../APIs/Trello/index");

    const email = args[0];

    message.reply("Adding you to Trello");
    const trello = await addBoardMember(email);

    console.log(trello);

    if (trello["error"] === "ERROR") {
      return message.channel.send(
        `An error ocurred while adding you to trello: ${trello["message"]}`
      );
    }
  }
};
