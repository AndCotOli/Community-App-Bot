module.exports = {
  name: "get-roles",
  description: "get all available roles with this command",
  execute(message, _args) {
    message.channel.send(`
    Available roles:
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
