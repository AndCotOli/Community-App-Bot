function prepareDataforGitHub(data) {
  return `
  {
    "name": ${data.name},
    "github": ${data.github},
    "image": "Enter_your_profile_image_url",
    "country_code": ${data.country_code},
    "active": true,
    "joined": "2018-12-16",
    "team_ids": [0, 1, 2, 3, 4]
  }
`;
}

module.exports = {
  name: 'activate',
  description: 'Get invited to all teams and fill your info in the Spreadsheet',
  args: true,
  async: true,
  usage: '<Your Name> <Your GitHub Username> <your@email> <Your Timezone>',
  async execute(message, args) {
    /*
      Desired Logic (the user has written !activate)
      1. Send a thanks message, and tell the user what we are going with the data it provides
      2. Start asking for info
        1. Create a user info object
          - Ask for
            - email
            - GitHub 
            - timezone
            - country code
          - Send a message to add the user to roles (by emoji reacting)
            - Add roles to the user object
          - Update the user in the DB
        2. Register in services
          - Add the user to Trello
          - Add the user to the SpreadSheet
          - Format the user data to fit the contributors format, and send it back
            - Send instructions to the user to what to do with that data.
    */

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
