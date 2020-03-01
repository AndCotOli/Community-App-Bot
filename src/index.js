require('dotenv').config();
require('./DB/');
const jobs = require('./Jobs');
const discordBot = require('./Bot');

for (let job of jobs) {
  job.start();
}

discordBot.login(process.env.DISCORD_TOKEN);
