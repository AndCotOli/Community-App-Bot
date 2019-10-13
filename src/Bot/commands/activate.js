module.exports = {
  name: 'activate',
  description: 'Get invited to all teams and fill your info in the Spreadsheet',
  args: true,
  async: true,
  usage: '<Your Name> <Your GitHub Username> <your@email> <Your Timezone>',
  async execute(message, args) {
    const { addBoardMember } = require('../../APIs/Trello');
    const SheetsHandler = require('../../APIs/GSpreadsheets');

    const Sheets = new SheetsHandler(process.env.SHEET_ID);

    const name = args[0],
      github = args[1],
      email = args[2],
      timezone = args[3];

    message.reply('Adding you to Trello...');
    const trello = await addBoardMember(email);

    if (trello.error === 'ERROR') {
      return message.reply(
        `An error ocurred while adding you to trello: ${trello.message}`
      );
    }
    message.reply('Succesfully added to Trello!');

    message.reply('Adding you to the SpreadSheet...');

    await Sheets.append([
      [name, message.author.tag, github, email, null, timezone]
    ]);

    message.reply('Succesfully added to the SpreaadSheet');
  }
};
