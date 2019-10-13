require('dotenv').config();
const discordBot = require('./Bot');

discordBot.login(process.env.DISCORD_TOKEN);
