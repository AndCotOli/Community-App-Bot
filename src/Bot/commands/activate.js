const User = require('../../DB/Models/User');
const { getEmailFromGitHub } = require('../../APIs/Github');
const { addBoardMember } = require('../../APIs/Trello/index');
const SheetsHadler = require('../../APIs/GSpreadsheets/index');

const Sheets = new SheetsHadler(process.env.SHEET_ID);

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

async function getTimezone(channel, authorId) {
  channel.send('Enter your timezone (in UTC±XX:XX format):');
  let timezoneCollector = await channel.awaitMessages(
    m => m.author.id === authorId,
    {
      max: 1,
      time: 180_000,
      errors: ['time']
    }
  );
  let timezone = timezoneCollector.first().content;

  if (!/UTC(\+|-)\d{2}:\d{2}/g.test(timezone)) {
    channel.send('Not a valid timezone.');
    return getTimezone(channel, authorId);
  }

  return timezone;
}

async function getCountryCode(channel, authorId) {
  channel.send(
    'Enter your 3 letters country code. You can find it here https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes'
  );
  let countryCodeCollector = await channel.awaitMessages(
    m => m.author.id === authorId,
    {
      max: 1,
      time: 180_000,
      errors: ['time']
    }
  );
  let countryCode = countryCodeCollector.first().content;

  if (countryCode.length !== 3) {
    channel.send('Not a valid country Code, please run !activate again');
    return getCountryCode(channel, authorId);
  }

  return countryCode;
}

async function getEmail(channel, authorId) {
  let emailRxp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  channel.send('Please, enter your email:');
  let emailCollector = await channel.awaitMessages(
    m => m.author.id === authorId,
    {
      max: 1,
      time: 180_000,
      errors: ['time']
    }
  );
  let email = emailCollector.first().content;

  if (!emailRxp.test(email)) {
    channel.send('Not a valid email address');
    return getEmail(channel, authorId);
  }

  channel.send('Thanks');
  return email;
}

module.exports = {
  name: 'activate',
  description: 'Get invited to all teams and fill your info in the Spreadsheet',
  async: true,
  async execute(message, args) {
    const { channel } = message;

    if (channel.type === 'text')
      return channel.send('This command can only be run in DMs');

    channel.send(
      `Hey, glad to have you on board! I'll guide you through the activation process.
    All the data you send will be available to the rest of the contributors of the project.
    You'll have a maximum of 3 minutes to provide each piece of data.
          `
    );

    try {
      channel.send('Enter your name:');
      let nameCollector = await channel.awaitMessages(
        m => m.author.id === message.author.id,
        {
          max: 1,
          time: 180_000,
          errors: ['time']
        }
      );
      name = nameCollector.first().content;

      channel.send('Enter your GitHub username:');
      let githubCollector = await channel.awaitMessages(
        m => m.author.id === message.author.id,
        {
          max: 1,
          time: 180_000,
          errors: ['time']
        }
      );
      github = githubCollector.first().content;

      timezone = await getTimezone(channel, message.author.id);

      countryCode = await getCountryCode(channel, message.author.id);

      channel.send('All set and done, welcome in!');
    } catch (e) {
      return channel.send("Time's up, you'll need to be faster next time.");
    }

    let email;

    try {
      email = await getEmailFromGitHub(github);
    } catch (e) {
      channel.send('Invalid github username');
    }
    if (!email) {
      channel.send("Seems like you don't have a public email on GitHub.");
      email = await getEmail(channel, message.author.id);
    }

    //TODO: Emoji Reaction Role-Selection system

    let userDB = await User.findOne({ discordId: message.author.id });

    userDB.name = name;
    userDB.email = email;
    userDB.github = github;
    userDB.timezone = timezone;
    userDB.countryCode = countryCode;

    const trello = await addBoardMember(email);
    if (trello.error) {
      channel.send(
        'Something went wrong with Trello, please, contact an administrator.'
      );
    }

    const sheets = await Sheets.append([
      [
        name,
        `${message.author.tag}`,
        github,
        email,
        userDB.isInvitedGithub ? 'X' : '',
        timezone
      ]
    ]);
    if (sheets.error) {
      channel.send(
        'Something went wrong with GSheets, please, contact an administrator.'
      );
    } else {
      userDB.spreadSheetsPos = parseInt(
        sheets.updates.updatedRange.substr(23, 25)
      );
    }

    userDB.save(err => {
      if (err)
        throw new Error('A problem occured while saving the user to the DB');
    });
  }
};
