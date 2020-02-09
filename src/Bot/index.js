const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.activateCommands = new Discord.Collection();

const prefix = process.env.DISCORD_PREFIX;
const { visitor, gardener } = require('./roles.json');

const onGuildJoin = require('./tasks/onGuildJoin');

client.once('ready', () => {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, './commands'))
    .filter(file => file.endsWith('.js'));

  for (file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
  console.log(colors.blue('Discord Bot Running'));

  // client.guilds.map(guild => guild.systemChannel.send('Bot connected'));
});

client.on('guildCreate', async guild => {
  if (!guild.available) return;

  onGuildJoin(guild);
});

client.on('guildMemberAdd', member => {
  member.guild.systemChannel.send(`${member} joined the server!`);
  member.addRole(visitor);
  member.send(`
    Hello and welcome to the Coding Garden Community Discord!

    To get started, fill the following commands:
      - \`!activate your_name github_username your@email timezone\`
    
    To get the roles, you'll need to do:
      - \`!get-roles  \`
      And select the corresponding role with
      - \`!set-role role1 role2 role3 ...  \`

    If you want to know the commands for this bot, use \`!help \`

    And remember, have fun!
  `);
  // onUserJoin(member)
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  let command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return message.channel.send('Not a valid command');

  if (command.args && !args.length)
    return message.reply("You didn't provide any arguments");

  if (command.admin && !message.member.roles.has(gardener))
    return message.reply('You must be an admin to use this command');

  try {
    if (command.async) {
      await command.execute(message, args);
    } else {
      command.execute(message, args);
    }
  } catch (e) {
    console.log(colors.red(`An error ocurred running a command:\n${e}`));
  }
});

process.on('unhandledRejection', error =>
  console.log(colors.red('Uncaught Promise Rejection', error))
);

module.exports = client;
