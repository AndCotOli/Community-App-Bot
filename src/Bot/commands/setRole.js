module.exports = {
  name: "set-role",
  description: "Set or delete your roles with this command",
  usage: "<roleName1> <roleName2> <roleName3> ...",
  args: true,
  execute(message, args) {
    const roles = require("../roles.json");
    if (message.member.roles.has(roles.visitor))
      message.member
        .removeRole(roles.visitor)
        .then(message.reply("Removed from visitor role"));
    args.map(role => {
      if (role === "visitor" || role === "gardener")
        return message.reply(`You can't be added to ${role}`);

      if (!roles[role]) return message.reply("Not a valid role");

      if (message.member.roles.has(roles[role])) {
        message.member
          .removeRole(roles[role])
          .then(message.reply(`Removed from ${role}`));

        if (message.member.roles.size === 2)
          message.member
            .addRole(roles.visitor)
            .then(message.reply("Added to visitor role"));
      } else {
        message.member
          .addRole(roles[role])
          .then(message.reply(`Added to ${role}`));
      }
    });
  }
};
