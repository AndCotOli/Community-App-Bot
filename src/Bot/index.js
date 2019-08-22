const colors = require("colors/safe");
const fs = require("fs");
const moment = require("moment-timezone");
const timezones = require("./timezone.json");

const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const { token, prefix } = require("./config.json");
const { visitor, gardener } = require("./roles.json");

const { readDB } = require("./Db");

client.login(token);

client.once("ready", () => {
  const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

  for (file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }

  readDB();

  moment.tz.load(timezones);

  console.log(colors.blue("Discord Bot Running"));
});

client.on("guildMemberAdd", member => {
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
});

client.on("message", async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return message.channel.send("Not a valid command");

  if (command.args && !args.length)
    return message.reply("You didn't provide any arguments");

  if (command.admin && !message.member.roles.has(gardener))
    return message.reply("You must be an admin to use this command");

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
process.on("unhandledRejection", error =>
  console.log(colors.red("Uncaught Promise Rejection", error))
);
