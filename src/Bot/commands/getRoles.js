module.exports = {
  name: "get-roles",
  description: "get all availabe roles with this command",
  execute(message, _args) {
    message.channel.send(`
    Availabe roles:
\`\`\`
  -planning
  -designer
  -frontend
  -backend
  -devops
  -tester
\`\`\``);
  }
};
