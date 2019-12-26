module.exports = {
  name: 'memory',
  description: 'Get the current memory the bot is using',
  execute(message, _args) {
    const normalize = memory => Math.round((memory / 1024 / 1024) * 100) / 100;

    const used = process.memoryUsage();
    for (let key in used) {
      message.channel.send(`${key} memory is using: ${normalize(used[key])}MB`);
    }
  }
};
