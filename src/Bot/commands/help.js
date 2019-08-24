module.exports = {
  name: "help",
  aliases: ["commands", "command"],
  usage: "<?command>",
  description: "Get info about all the commands or an specific one",
  execute(message, args) {
    const { prefix } = require("../config.json");
    const { commands } = message.client;
    const data = [];

    if (!args.length) {
      data.push("Command list:");
      data.push("```");
      commands.map(cmd => {
        data.push(`- !${cmd.name}`);
        data.push(`\t${cmd.description}`);
      });
      data.push("```");
      data.push(
        "To get more info about an specific command, use `!help commandName`"
      );

      return message.channel.send(data.join("\n"), { split: true });
    }

    const name = args[0].toLowerCase();

    const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) return message.reply("Not a valid command");

    data.push(`**Name** : ${command.name}`);
    if (command.aliases) data.push(`Aliases ${command.aliases.join(", ")}`);
    data.push(`**Description** : ${command.description}`);
    if (command.usage)
      data.push(`**Usage** : ${prefix}${command.name} ${command.usage}`);
    if (command.admin)
      data.push("You need to be a gardener to use this command");
    message.channel.send(data.join("\n"), { split: true });
  }
};
